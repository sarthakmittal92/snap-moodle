import sqlite3
import sys
import re
import requests

from pygments.lexers.sql import SqlLexer
from prompt_toolkit import PromptSession
from prompt_toolkit.completion import WordCompleter
from prompt_toolkit.lexers import PygmentsLexer
from prompt_toolkit.styles import Style
from prompt_toolkit.validation import Validator

sql_completer = WordCompleter(["signup", "login", "submit"], ignore_case=True)

style = Style.from_dict({
    "completion-menu.completion": "bg:#008888 #ffffff",
    "completion-menu.completion.current": "bg:#00aaaa #000000",
    "scrollbar.background": "bg:#88aaaa",
    "scrollbar.button": "bg:#222222"
})


# def is_valid_email(text):
#     return "@" in text


# validator = Validator.from_callable(
#     is_valid_email,
#     error_message="Not a valid e-mail address (Does not contain an @)",
#     move_cursor_to_end=True,
# )


def main(database):
    # CLI session
    connection = sqlite3.connect('file:' + database, uri=True)
    cursor = connection.cursor()
    session = PromptSession(lexer=PygmentsLexer(
        SqlLexer), completer=sql_completer, style=style)

    # Signup/Login
    while True:
        logged = False
        teacher = True
        try:
            print("Use command 'signup' to begin registration.")
            print("Use command 'login' to connect to sever.")
            print("Ctrl-D to quit.")
            command = session.prompt('SNAPMoodle-CLI>> ', is_password=False)
        except KeyboardInterrupt:
            continue  # ctrl-c
        except EOFError:
            break  # ctrl-d

        if command == 'signup':
            signup = 0
            data = {}
            print()
            print('Beginning signup. Ctrl-D to quit.')
            while signup != 5:
                if signup == 0:
                    try:
                        username = session.prompt(
                            'Enter username: ', is_password=False, complete_while_typing=False)
                        data['username'] = username
                        signup = 1
                    except KeyboardInterrupt:
                        continue  # ctrl-c
                    except EOFError:
                        break  # ctrl-d
                elif signup == 1:
                    try:
                        email = session.prompt(
                            'Enter email: ', is_password=False, complete_while_typing=False)
                        data['email'] = email
                        if "@" in email:
                            signup = 2
                        else:
                            print("Invalid email.")
                    except KeyboardInterrupt:
                        continue  # ctrl-c
                    except EOFError:
                        break  # ctrl-d
                elif signup == 2:
                    try:
                        password1 = session.prompt(
                            'Enter password: ', is_password=True, complete_while_typing=False)
                        data['password1'] = password1
                        signup = 3
                    except KeyboardInterrupt:
                        continue  # ctrl-c
                    except EOFError:
                        break  # ctrl-d
                elif signup == 3:
                    try:
                        password2 = session.prompt(
                            'Confirm password: ', is_password=True, complete_while_typing=False)
                        data['password2'] = password2
                        if password1 == password2:
                            signup = 4
                        else:
                            print("Passwords do not match.")
                            signup = 2
                    except KeyboardInterrupt:
                        continue  # ctrl-c
                    except EOFError:
                        break  # ctrl-d
                elif signup == 4:
                    try:
                        is_student = session.prompt(
                            'Are you a student (Yes: 1, No: 0)? ', is_password=False, complete_while_typing=False)
                        data['is_student'] = is_student
                        if not is_student:
                            teacher = True
                        signup = 5
                    except KeyboardInterrupt:
                        continue  # ctrl-c
                    except EOFError:
                        break  # ctrl-d
            if signup == 5:
                try:
                    response = requests.post(
                        "http://127.0.0.1:8000/rest-auth/registration/", data)
                    if response:
                        loginToken = response.json()['key']
                        print(data['username'] + ' logged in.')
                        logged = True
                        break
                    else:
                        print("Signup failed.")
                except Exception as e:
                    print("Signup failed.")

        elif command == 'login':
            login = 0
            data = {}
            print()
            print("Beginning login. Ctrl-D to quit.")
            while login != 2:
                if login == 0:
                    try:
                        username = session.prompt(
                            'Enter username: ', is_password=False, complete_while_typing=False)
                        data['username'] = username
                        login = 1
                    except KeyboardInterrupt:
                        continue  # ctrl-c
                    except EOFError:
                        break  # ctrl-d
                elif login == 1:
                    try:
                        password = session.prompt(
                            'Enter password: ', is_password=True, complete_while_typing=False)
                        data['password'] = password
                        login = 2
                    except KeyboardInterrupt:
                        continue  # ctrl-c
                    except EOFError:
                        break  # ctrl-d
            if login == 2:
                try:
                    response = requests.post(
                        "http://127.0.0.1:8000/rest-auth/login/", data)
                    if response:
                        loginToken = response.json()['key']
                        print(data['username'] + ' logged in.')
                        logged = True
                        break
                    else:
                        print("Login failed.")
                except Exception as e:
                    print("Login failed.")

        else:
            try:
                messages = cursor.execute(command)
                for message in messages:
                    print(message)
            except Exception as e:
                print("Invalid command.")

    if logged:
        username = data['username']
        # Data loop
        while True:
            try:
                print()
                print("Use command 'submit' to upload file.")
                print("Use command 'grade' to check grades.")
                print("Use command 'logout' to sign off.")
                print("Ctrl-D to quit.")
                command = session.prompt(
                    'SNAPMoodle-CLI>> ', is_password=False)
            except KeyboardInterrupt:
                continue  # ctrl-c
            except EOFError:
                break  # ctrl-d

            if command == 'submit':
                submit = 0
                data = {}
                print()
                print("Beginning file submission. Ctrl-D to quit.")
                while submit != 4:
                    if submit == 0:
                        try:
                            code = session.prompt(
                                'Enter course code (enter X if you already have access): ', is_password=False, complete_while_typing=False)
                            accessParams = {
                                'username': username, 'accessCode': code}
                            try:
                                response = requests.get('http://127.0.0.1:8000/courses/code/', params=accessParams, headers={
                                                        'Authorization': 'Token ' + loginToken})
                                if response:
                                    courseList = {}
                                    courseSet = response.json()
                                    print('List of courses:')
                                    for courseObj in courseSet:
                                        courseList[courseObj['title']
                                                   ] = courseObj['id']
                                        print(courseObj['title'])
                                    submit = 1
                                else:
                                    print('Invalid access.')
                            except Exception as e:
                                print('Exception: Invalid access.')
                        except KeyboardInterrupt:
                            continue  # ctrl-c
                        except EOFError:
                            break  # ctrl-d
                    elif submit == 1:
                        try:
                            course = session.prompt(
                                'Choose course: ', is_password=False, complete_while_typing=False)
                            if course in courseList.keys():
                                accessParams = {'course': courseList[course]}
                                try:
                                    response = requests.get('http://127.0.0.1:8000/assignments/', params=accessParams, headers={
                                                            'Authorization': 'Token ' + loginToken})
                                    if response:
                                        assgnList = {}
                                        assgnSet = response.json()
                                        print('List of assignments:')
                                        for assgnObj in assgnSet:
                                            assgnList[assgnObj['title']
                                                      ] = assgnObj['id']
                                            print(
                                                assgnObj['title'] + ' (Deadline: ' + assgnObj['deadline'] + ')')
                                        submit = 2
                                    else:
                                        print('Invalid course name.')
                                except Exception as e:
                                    print('Exception: Invalid course name.')
                        except KeyboardInterrupt:
                            continue  # ctrl-c
                        except EOFError:
                            break  # ctrl-d
                    elif submit == 2:
                        try:
                            assgn = session.prompt(
                                'Choose assignment: ', is_password=False, complete_while_typing=False)
                            if assgn in assgnList.keys():
                                accessParams = {'assgn': assgnList[assgn]}
                                try:
                                    response = requests.get('http://127.0.0.1:8000/assignments/', params=accessParams, headers={
                                                            'Authorization': 'Token ' + loginToken})
                                    if response:
                                        assgnId = response.json()[0]['id']
                                        deadline = response.json()[
                                            0]['deadline']
                                        submit = 3
                                    else:
                                        print('Invalid assignment name.')
                                except Exception as e:
                                    print('Exception: Invalid assignment name.')
                        except KeyboardInterrupt:
                            continue  # ctrl-c
                        except EOFError:
                            break  # ctrl-d
                    elif submit == 3:
                        try:
                            filePath = session.prompt('Give relative file paths (Ctrl-D to stop): ', is_password=False, complete_while_typing=False)
                            data['username'] = username
                            data['currentAssignment'] = assgnId
                            data['time_rem'] = True  # check time with deadline
                            try:
                                response = requests.post('http://127.0.0.1:8000/assignments/posts/', data, files={'submissionfile': open(filePath, 'rb')})
                                if not response:
                                    print('File submission failed.')
                            except Exception as e:
                                print('Exception: File submission failed.')
                        except KeyboardInterrupt:
                            continue  # ctrl-c
                        except EOFError:
                            submit = 4
                            if teacher:
                                data1 = {}
                                data1['currentAssignment'] = assgnId
                                try:
                                    requests.post('http://127.0.0.1:8000/assignments/feedback/', data1, headers={'Authorization': 'Token ' + loginToken})
                                except Exception:
                                    print("Grading failed.")
                            break  # ctrl-d

            elif command == 'grade':
                grade = 0
                data = {}
                print("Fetching grades. Ctrl-D to quit.")
                while grade != 2:
                    if grade == 0:
                        try:
                            code = session.prompt(
                                'Enter course code (enter X if you already have access): ', is_password=False, complete_while_typing=False)
                            accessParams = {
                                'username': username, 'accessCode': code}
                            try:
                                response = requests.get('http://127.0.0.1:8000/courses/code/', params=accessParams, headers={
                                                        'Authorization': 'Token ' + loginToken})
                                if response:
                                    courseList = {}
                                    courseSet = response.json()
                                    print('List of courses:')
                                    for courseObj in courseSet:
                                        courseList[courseObj['title']
                                                   ] = courseObj['id']
                                        print(courseObj['title'])
                                    grade = 1
                                else:
                                    print('Invalid access.')
                            except Exception as e:
                                print('Exception: Invalid access.')
                        except KeyboardInterrupt:
                            continue  # ctrl-c
                        except EOFError:
                            break  # ctrl-d

                    elif grade == 1:
                        try:
                            course = session.prompt(
                                'Choose course: ', is_password=False, complete_while_typing=False)
                            if course in courseList.keys():
                                accessParams = {
                                    'username': username, 'course': courseList[course]}
                                accessParams2 = {'course': courseList[course]}
                                try:
                                    response2 = requests.get(
                                        'http://127.0.0.1:8000/assignments/', params=accessParams2, headers={'Authorization': 'Token ' + loginToken})
                                    if response2:
                                        assgnList = {}
                                        assgnSet = response2.json()
                                        for assgnObj in assgnSet:
                                            assgnList[assgnObj['id']
                                                      ] = assgnObj['title']
                                    else:
                                        print('Invalid course name.')
                                except Exception as e:
                                    print('Exception: Invalid course name.')

                                try:
                                    response = requests.get('http://127.0.0.1:8000/grades/', params=accessParams, headers={
                                                            'Authorization': 'Token ' + loginToken})

                                    if response:

                                        gradeList = {}
                                        # assgnList = {}
                                        gradeSet = response.json()
                                        print('List of assignments with grades:')
                                        print(str(" ")*5 + str("-")*83)
                                        for gradeObj in gradeSet:

                                            print(str(' ') * (5) + '| Assignment: ' + assgnList[gradeObj['assignment']] + str(' ') * (10 - len(assgnList[gradeObj['assignment']])) + ' | ' + str(
                                                " ")*5 + 'Grade = ' + str(gradeObj['grade']) + ' | ' + str(' ')*(5) + ' | Feedback: ' + str(gradeObj['feedback']) + str(' ') * (20 - len(str(gradeObj['feedback']))) + ' | ')

                                        print(str(" ")*5 + str("-")*83)
                                        grade = 2
                                    else:
                                        print('Invalid course name.')
                                except Exception as e:
                                    print('Exception: in course access')
                        except KeyboardInterrupt:
                            continue  # ctrl-c
                        except EOFError:
                            break  # ctrl-d

            elif command == 'logout':
                break

            else:
                try:
                    messages = cursor.execute(command)
                    for message in messages:
                        print(message)
                except Exception as e:
                    print("Invalid command.")
                    
    print("Good bye!")


if __name__ == "__main__":
    if len(sys.argv) < 2:
        db = ":memory:"
    else:
        db = sys.argv[1]
    main(db)
