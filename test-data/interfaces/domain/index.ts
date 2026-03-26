import { DomainInstances } from "test-data/types";

export * from "./verification-domain-interfaces";
export * from "./vip-manager-domain-interfaces";
export * from "./free-spins-domain-interfaces";
export * from "./promo-code-domain-interfaces";
export * from "./geoblock-domain-interfaces";
export * from "./password-domain-interfaces";
export * from "./roulette-domain-interfaces";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IDomainsDataSource extends DomainInstances {}
