import { OriginalsDomainData } from "./originals-domain-data";
import { VerificationDomainData } from "./verification-domain-data";
import { VipManagerDomainData } from "./vip-manager-domain-data";
import { FreeSpinsDomainData } from "./free-spins-domain-data";
import { PromoCodeDomainData } from "./promo-code-domain-data";
import { AdminNewUsersDomainData } from "./admin-new-users-domain-data";
import { SokGamesDomainData } from "./sok-games-domain-data";
import { GeoblockDomainData } from "./geoblock-domain-data";
import { AdminWriterDomainData } from "./admin-writer-domain-data";
import { UserWalletDomainData } from "./user-wallet-domain-data";
import { CryptoWithdrawalDomainData } from "./crypto-withdrawal-domain-data";
import { HotWalletDomainData } from "./hot-wallet-domain-data";

export const domainRegistry = {
	originals: OriginalsDomainData,
	vipManager: VipManagerDomainData,
	freeSpins: FreeSpinsDomainData,
	userWallet: UserWalletDomainData,
	verification: VerificationDomainData,
	promoCodes: PromoCodeDomainData,
	adminNewUsers: AdminNewUsersDomainData,
	adminWriter: AdminWriterDomainData,
	sokGames: SokGamesDomainData,
	oAuthLogin: GeoblockDomainData,
	cryptoWithdrawal: CryptoWithdrawalDomainData,
	hotWallet: HotWalletDomainData,
};
