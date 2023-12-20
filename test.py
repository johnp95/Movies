def func(f):
    def wrapper():
        print("Started ")
        f()
        print("ended")

    return wrapper()

def func2():
    print('i am func2')

@func
def func3():
    print('I am func3')
