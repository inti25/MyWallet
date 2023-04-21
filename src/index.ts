import {QMainWindow} from '@nodegui/nodegui';
import {Router} from "./Router";
import {Main} from "./screens/Main";
import {User} from "./model/User";

const win = new QMainWindow();
win.setWindowTitle("My Wallet");
win.setFixedSize(300, 400);
const route = new Router(win);
route.change(Main.name);
const user = new User('', [], '');
user.load();
win.setStyleSheet(
  `
    #PrimaryButton {
      background-color: #2ea44f;
      border: 1px solid rgba(27, 31, 35, .15);
      border-radius: 6px;
      align-items: 'center';
      justify-content: 'center';
      font-size: 14px;
      font-weight: 600;
      line-height: 20px;
      padding: 6px 16px;
      position: relative;
      color: #fff;
    }
    #PrimaryButton:hover {
      background-color: #2c974b;
    }
    #PrimaryButton:pressed {
      background-color: #298e46;
    }
    #SecondaryButton {
      background-color: #2f80ed;
      border-radius: 6px;
      align-items: 'center';
      justify-content: 'center';
      font-size: 14px;
      font-weight: 600;
      line-height: 20px;
      padding: 6px 16px;
      position: relative;
      color: #fff;
    }
    #SecondaryButton:hover {
      background-color: #1366d6;
    }
    #SecondaryButton:pressed {
      background-color: #13458d;
    }
  `
);
win.show();

(global as any).win = win;
(global as any).user = user;
