import { EventEmitter } from "events";

declare interface HostBase {
	hostname: string;
	openPorts: [];
	osNmap?: string;
}

declare interface HostIPv4 extends HostBase {
	ip: string;
}

declare interface HostMAC extends HostBase {
	mac: string;
	vendor: string;
}

declare interface Port {
	port: number;
	protocol: string;
	service?: string;
	tunnel?: string;
	method?: string;
	product?: string;
	certificate?: Certificate;
}

declare interface Certificate {
	subject: CertificateOrganization;
	issuer: CertificateOrganization;
	pubKey: CertificatePublicKey;
	validity: CertificateValidity;
	extensions?: { [key: string]: string };
	algorithm: string;
	md5?: string;
	sha1?: string;
	pem?: string;
}

declare interface CertificateOrganization {
	commonName?: string;
	countryName?: string;
	organizationName?: string;
	stateOrProvinceName?: string;
}

declare interface CertificatePublicKey {
	type: string;
	bits: string;
	exponent?: string;
	modulus?: string;
}

declare interface CertificateValidity {
	notBefore: string;
	notAfter: string;
}

declare type Host = HostIPv4 | HostMAC;

declare type NmapScanEvents = {
	"complete": (results: Host[]) => any;
	"error": (error: string) => any;
}

declare class NmapScan extends EventEmitter {

	public scanResults: Host[];
	public scanTime: number;
	public scanTimeout: number;

	public constructor(range: string, arguments: string);

	public cancelScan(): void;
	public startScan(): void;

	public on<Event extends keyof NmapScanEvents>(event: Event, listener: NmapScanEvents[Event]): EventEmitter;

}

declare class QuickScan extends NmapScan {

	public constructor(range: string);

}

declare class OsAndPortScan extends NmapScan {

	public constructor(range: string);

}

declare class QueuedScan<ActionReturnType = void> extends EventEmitter {

	public scanTime: number;
	public singleScanTimeout: number;
	public currentScan: NmapScan | undefined;

	public runActionError: boolean;
	public saveErrorsToResults: boolean;
	public saveNotFoundToResults: boolean;

	public constructor(scanClass: typeof NmapScan, range: string, args: string, action: (results: Host[]) => ActionReturnType);

	public startRunScan(): void;
	public startShiftScan(): void;

	public pause(): void;
	public resume(): void;

	public next(count: number): ActionReturnType;
	public shift(count: number): ActionReturnType;

	public results(): Host[];
	public shiftResults(): Host | undefined;

	public index(): number;

	public percentComplete(): number;

	public on<Event extends keyof NmapScanEvents>(event: Event, listener: NmapScanEvents[Event]): EventEmitter;

}

declare class QueuedNmapScan<ActionReturnType = void> extends QueuedScan<ActionReturnType> {

	public constructor(range: string, arguments: string, action?: (results: Host[]) => ActionReturnType)

}

declare class QueuedQuickScan<ActionReturnType = void> extends QueuedScan<ActionReturnType> {

	public constructor(range: string, action?: (results: Host[]) => ActionReturnType)

}

declare class QueuedOsAndPortScan<ActionReturnType = void> extends QueuedScan<ActionReturnType> {

	public constructor(range: string, action?: (results: Host[]) => ActionReturnType)

}

declare let nmapLocation: string;
