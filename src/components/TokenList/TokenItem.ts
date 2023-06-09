import {
  CursorShape,
  FlexLayout,
  QIcon,
  QLabel,
  QPixmap,
  QPushButton,
  QSize,
  QWidget,
} from "@nodegui/nodegui";
import { Token } from "../../model/Token";
import { getPixmap } from "../../utils/imageUtil";
import { getProvider, getSigner } from "../../utils/globalUtil";
import { ethers, formatEther, formatUnits, ZeroAddress } from "ethers";

import icSend from "../../../assets/send.png";
import icRefresh from "../../../assets/refresh.png";
import { TransferDialog } from "../../screens/transfer/TransferDialog";
import { formatCurrencyUSD } from "../../utils/common";
import erc20Abi from "../../abis/erc20.json";

export class TokenItem extends QWidget {
  token: Token;
  private logo: QLabel = new QLabel();
  private tokenName: QLabel = new QLabel();
  private balance: QLabel = new QLabel();
  private btnRefresh = new QPushButton();
  private btnSend = new QPushButton();

  constructor(token: Token) {
    super();
    this.setObjectName(TokenItem.name);
    this.token = token;
    this.initLayout();
    this.updateData();
  }

  private setIcon(img: QPixmap) {
    if (this.native && img) {
      this.logo.setPixmap(img);
    }
  }

  private setBalance(bal: string) {
    if (this.native) {
      this.balance.setText(formatCurrencyUSD(bal));
    }
  }

  getBalance(): number {
    return parseFloat(this.balance.text().replace(",", ""));
  }

  async updateData() {
    this.setIcon(await getPixmap(this.token.image || ""));
    const signer = getSigner();
    const address = await signer.getAddress();
    if (this.token.address === ZeroAddress && address) {
      const bal = await getProvider().getBalance(address);
      this.setBalance(formatEther(bal));
    } else if (this.token.address != null) {
      const tokenContract = new ethers.Contract(
        this.token.address,
        erc20Abi,
        signer as any
      );
      const bal = await tokenContract.balanceOf(address);
      this.setBalance(formatUnits(bal, this.token.decimals));
    } else {
      this.setBalance("0.0");
    }
  }

  private initLayout() {
    const layout = new FlexLayout();
    this.setLayout(layout);
    layout.addWidget(this.logo);
    this.logo.setObjectName("TokenImage");
    this.logo.setFixedSize(36, 36);
    this.logo.setScaledContents(true);
    const container = new QWidget();
    container.setObjectName("TokenContainer");
    const container_layout = new FlexLayout();
    container.setLayout(container_layout);
    this.tokenName.setObjectName("TokenText");
    this.balance.setObjectName("TokenText");
    this.tokenName.setText(this.token.name || "");
    this.balance.setText("0.0");
    container_layout.addWidget(this.tokenName);
    container_layout.addWidget(this.balance);
    layout.addWidget(container);

    this.btnRefresh.setIcon(new QIcon(icRefresh));
    this.btnRefresh.setIconSize(new QSize(24, 24));
    this.btnRefresh.setCursor(CursorShape.PointingHandCursor);
    this.btnRefresh.setFlat(true);
    this.btnRefresh.setAutoExclusive(true);
    this.btnRefresh.setToolTip("Update Balance");
    this.btnRefresh.addEventListener("clicked", () => {
      this.updateData();
    });
    this.btnSend.setIcon(new QIcon(icSend));
    this.btnSend.setIconSize(new QSize(24, 24));
    this.btnSend.setCursor(CursorShape.PointingHandCursor);
    this.btnSend.setFlat(true);
    this.btnSend.setAutoExclusive(true);
    this.btnSend.setToolTip("Send Token");
    this.btnSend.addEventListener("clicked", () => {
      const dg = new TransferDialog({
        token: this.token,
        balance: parseFloat(this.balance.text()),
      });
      dg.show();
    });
    layout.addWidget(this.btnRefresh);
    layout.addWidget(this.btnSend);
  }

  setHiddenActionBtn(isHidden: boolean) {
    if (isHidden) {
      this.btnSend.setHidden(true);
      this.btnRefresh.setHidden(true);
    } else {
      this.btnSend.setHidden(false);
      this.btnRefresh.setHidden(false);
    }
  }
}
