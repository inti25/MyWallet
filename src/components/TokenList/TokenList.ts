import { FlexLayout, QWidget } from "@nodegui/nodegui";
import {
  getGlobalEvent,
  setCurrentAccount,
  setCurrentNetwork,
} from "../../utils/globalUtil";
import { Token } from "../../model/Token";
import { TokenItem } from "./TokenItem";
import { Network } from "../../model/Network";
import { ethers, ZeroAddress } from "ethers";

export class TokenList extends QWidget {
  private root: FlexLayout | undefined;
  currentNetwork: Network | undefined;
  tokens: Token[] | undefined;
  items: TokenItem[] = [];
  constructor() {
    super();
    this.setObjectName(TokenList.name);
    this.addListener();
    this.initData().then(() => {});
  }

  async initData() {
    const tokensData = await Token.loadTokens();
    const nativeToken = new Token();
    nativeToken.name = this.currentNetwork?.nativeSymbol;
    nativeToken.chainId = this.currentNetwork?.id;
    nativeToken.decimals = 18;
    nativeToken.symbol = this.currentNetwork?.nativeSymbol;
    nativeToken.address = ZeroAddress;
    nativeToken.image = this.currentNetwork?.nativeImage;
    const tokens = tokensData.filter((token) => {
      return token.chainId === this.currentNetwork?.id;
    });
    tokens.unshift(nativeToken);
    this.tokens = tokens;
    this.initView();
  }

  initView() {
    if (!this.native) return;
    for (const i of this.items) {
      i.delete();
    }
    this.root?.delete();
    this.items = [];
    this.root = new FlexLayout();
    this.setLayout(this.root);
    if (this.tokens) {
      for (const token of this.tokens) {
        const item = new TokenItem(token);
        this.root.addWidget(item);
        this.items.push(item);
      }
    }
  }

  addListener() {
    getGlobalEvent().addListener("onNetworkChanged", (args) => {
      console.log("onNetworkChanged");
      this.currentNetwork = args;
      setCurrentNetwork(args);
    });
    getGlobalEvent().addListener("onAccountSelected", (args) => {
      console.log("onAccountSelected");
      setCurrentAccount(args);
      this.initData();
    });
  }
}