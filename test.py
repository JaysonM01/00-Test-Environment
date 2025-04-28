from machine import Pin, UART
import utime
import uasyncio as uaio

led_red_1 = Pin(2, Pin.OUT)
led_red_2 = Pin(3, Pin.OUT)
led_green_1 = Pin(6, Pin.OUT)
led_green_2 = Pin(7, Pin.OUT)
buzzer = Pin(15, Pin.OUT)
reset = Pin(16, Pin.IN, Pin.PULL_DOWN)
switch = Pin(17, Pin.IN, Pin.PULL_DOWN)
uart = UART(1, bits=7, parity=2, stop=2, baudrate=9600, tx=Pin(4), rx=Pin(5))

last_state = 0
current_state = 0

# is_busy = False
# test_in_progress = False
waiting_for_result = None


def init_test_flags():
    global test_a_failed, test_a_passed
    global test_b_failed, test_b_passed
    global waiting_for_result
    waiting_for_result = None
    test_a_failed = None
    test_a_passed = None
    test_b_failed = None
    test_b_passed = None
    reset.value(0)
    switch.value(0)

async def process_result():
    print("Process test result")
    uart.write("@00RD01*\r\n".encode('utf-8'))
    #await uaio.sleep_ms(100)
    
    global waiting_for_result
    waiting_for_result = True
    
    rxData = bytes()
    while waiting_for_result:
        #print("Awaiting for response...")
       
        if uart.any():
            rxData = uart.read()
        
        #print("rxData length:"+str(len(rxData)))
        
        if not len(rxData) == 0:
            #print(rxData.decode('utf-8'))        
            await process_response(rxData.decode('utf-8'))
            waiting_for_result = False
        
        await uaio.sleep_ms(100)

    print("Process complete")
    
async def process_response(response):
    #print(response)
    # @00WRXXII*
    
    if len(response) < 10:
        return
    
    result = response[5:7]
    #print(result)
    
    global test_a_failed, test_a_passed
    global test_b_failed, test_b_passed    
    
    # possible response permutation
    if result == "00":
        # 00 = A and B passed
        test_a_passed = True
        test_b_passed = True
        test_a_failed = False
        test_b_failed = False
        
    elif result == "10":
        # 10 = A failed B passed
        test_a_passed = False
        test_b_passed = True
        test_a_failed = True
        test_b_failed = False
        
    elif result == "01":
        # 01 = A passed B failed
        test_a_passed = True
        test_b_passed = False
        test_a_failed = False
        test_b_failed = True
        
    elif result == "11":
        # 11 = A and B failed
        test_a_passed = False
        test_b_passed = False
        test_a_failed = True
        test_b_failed = True
        
    else:
        return
    
# async def activate_buzzer():
#     global test_failed
#     while True:
#         if test_failed:
#             print("Trigger buzzer")
#             buzzer.value(1)
#             utime.sleep(1)
#             buzzer.value(0)
#             # utime.sleep(2)
#             # await uaio.sleep_ms(100)
#         await uaio.sleep_ms(1000)
        
async def activate_red_a():
    global test_a_failed
    while True:
        if test_a_failed:
            led_red_1.value(1)
            await uaio.sleep_ms(1000)
            led_red_1.value(0)
            init_test_flags()
        else:
            led_red_1.value(0)
        await uaio.sleep_ms(100)

async def activate_green_a():
    global test_a_passed
    while True:
        if test_a_passed:
            led_green_1.value(1)
            await uaio.sleep_ms(1000)
            led_green_1.value(0)
            init_test_flags()
        else:
            led_green_1.value(0)
        await uaio.sleep_ms(100)

async def activate_red_b():
    global test_b_failed
    while True:
        if test_b_failed:
            led_red_2.value(1)
            await uaio.sleep_ms(1000)
            led_red_2.value(0)
            init_test_flags()
        else:
            led_red_2.value(0)
        await uaio.sleep_ms(100)

async def activate_green_b():
    global test_b_passed
    while True:
        if test_b_passed:
            led_green_2.value(1)
            await uaio.sleep_ms(1000)
            led_green_2.value(0)
            init_test_flags()
        else:
            led_green_2.value(0)
        await uaio.sleep_ms(100)
        
async def reset_alarm():
    #global test_failed, test_passed
    is_reset = False
    while True:
        if reset.value() == 1 and not is_reset:
            init_test_flags()
            is_reset = True
            print("reset pressed")
        elif reset.value() == 0 and is_reset:
            #reset.value(0)
            is_reset = False
            print("reset restored")
        
        await uaio.sleep_ms(100)

async def monitor_test():
    global current_state
    global last_state
#     global test_in_progress
    current_state = switch.value()
    #print(current_state)
    if ((current_state == 1) and (not current_state == last_state)):
        print("start of test")
        init_test_flags()
        last_state = current_state
    # check if button is release after being pressed
    elif ((current_state == 0) and (last_state == 1)):
        print("end of test")
        last_state = current_state
        await process_result()
#     elif ((current_state == 0) and (last_state == 1)):
#         print("start of test")
#         last_state = current_state
#     
#         print("Unknown state")
#     print(last_state)
    await uaio.sleep_ms(100)
    
async def main():
    print("Main func")
    init_test_flags()
    # create coroutines for sensor, buzzer and LED
    #uaio.create_task(activate_buzzer())
    uaio.create_task(activate_red_a())
    uaio.create_task(activate_green_a())
    uaio.create_task(activate_red_b())
    uaio.create_task(activate_green_b())
    uaio.create_task(reset_alarm())
    while True:
        # monitor test trigger
        # print("call monitor_test()")        
        await monitor_test()
        # print("called monitor_test()")
        # yield to other existing tasks
        await uaio.sleep_ms(100)    

uaio.run(main())