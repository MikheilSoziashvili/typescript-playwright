import { OriginalsDomainData } from "./originals-domain-data";
import { VerificationDomainData } from "./verification-domain-data";
import { VipManagerDomainData } from "./vip-manager-domain-data";
import { FreeSpinsDomainData } from "./free-spins-domain-data";
import { PromoCodeDomainData } from "./promo-code-domain-data";
import { AdminNewUsersDomainData } from "./admin-new-users-domain-data";

export const domainRegistry = {
	originals: OriginalsDomainData,
	vipManager: VipManagerDomainData,
	freeSpins: FreeSpinsDomainData,
	verification: VerificationDomainData,
	promoCodes: PromoCodeDomainData,
	adminNewUsers: AdminNewUsersDomainData,
};
