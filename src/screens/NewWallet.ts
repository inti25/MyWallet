import {FlexLayout, QLabel, QPixmap, QPushButton} from "@nodegui/nodegui";
import {Main} from "./Main";
import {BaseScreen} from "./BaseScreen";
import wallet from '../../assets/wallet.png';
import {ethers} from "ethers";
import {saveFile} from "../utils/fileUtil";

export class NewWallet extends BaseScreen {

  constructor() {
    super(NewWallet.name);
  }

  initLayout() {
    const layout = new FlexLayout();
    // layout.setObjectName(NewWallet.name)
    this.root.setLayout(layout);

    const image = new QPixmap();
    image.load(wallet);

    const label = new QLabel();
    label.setPixmap(image);

    // Buttons
    const newBtn = new QPushButton();
    newBtn.setText('Create a new wallet');
    newBtn.setObjectName('PrimaryButton');
    newBtn.addEventListener('clicked', () => {
      // this.changeView(Main.name)
      const wallet = ethers.Wallet.createRandom();
      saveFile({mnemonic: wallet.mnemonic?.phrase}, 'wallet');
    });

    const importBtn = new QPushButton();
    importBtn.setText('Import an existing wallet');
    importBtn.setObjectName('SecondaryButton');
    importBtn.addEventListener('clicked', () => {
      this.changeView(Main.name)
    });

    layout.addWidget(label);
    layout.addWidget(newBtn);
    layout.addWidget(importBtn);

    this.root.setStyleSheet(`
        #NewWallet{
          background-color: #009688;
          flex-direction: 'column';
          align-items: 'center';
          justify-content: 'space-around';
        }
    `)
  }
}