import { EventEmitter } from 'events';
import SchemaManager from '@tf2autobot/tf2-schema';
import SteamID from 'steamid';
import TF2Currencies from '@tf2autobot/tf2-currencies';

declare class ListingManager extends EventEmitter {
    static EFailiureReason: Record<string, unknown>;

    constructor(options?: {
        token?: string;
        steamid?: string;
        userAgent?: string;
        userID?: string;
        waitTime?: number;
        batchSize?: number;
        schema?: SchemaManager.Schema;
    });

    token: string | undefined;

    steamid: SteamID;

    waitTime: number;

    batchSize: number;

    cap: number | null;

    promotes: number | null;

    listings: ListingManager.Listing[];

    actions: { create: ListingManager.CreateListing[]; remove: string[] };

    ready: boolean;

    schema: SchemaManager.Schema | null;

    _timeout: ReturnType<typeof setTimeout>;

    _updateInventoryInterval: ReturnType<typeof setInterval>;

    async init(callback: (err: any) => void): void;

    setUserID(userID: string): void;

    getListings(onShutdown: boolean, callback: (err: any, body?: any) => any): void;

    findListing(search: string | number): ListingManager.Listing | null;

    findListings(sku: string): ListingManager.Listing[];

    createListing(listing: ListingManager.CreateListing): void;

    createListings(listings: ListingManager.CreateListing[]): void;

    updateListing(listingId: string, properties: ListingManager.UpdateListing): void;

    removeListing(listing: RemoveListing): void;

    removeListings(listings: RemoveListing[]): void;

    deleteAllListings(callback: (err: any, body?: any) => any): void;

    deleteAllListings(intent: number, callback: (err: any, body?: any) => any): void;

    async shutdown(): void;

    _processActions: (callback: (err?: Error) => void) => void;

    on(event: 'ready', handler: () => void): this;

    on(event: 'listings', handler: (listings: ListingManager.Listing[]) => void): this;

    on(event: 'actions', handler: (actions: { create: Record<string, unknown>[]; remove: string[] }) => void): this;

    on(
        event: 'pulse',
        handler: (pulse: { status: string; current_time?: number; expire_at?: number; client?: string }) => void
    ): this;

    on(event: 'inventory', handler: (lastUpdated: number) => void): this;

    on(event: 'createListingsError', handler: (err: ListingManager.CustomError) => void): this;

    on(
        event: 'createListingsSuccessful',
        handler: (response: { created: number; archived: number; errors: { message: string }[] }) => void
    ): this;

    on(event: 'updateListingsError', handler: (err: ListingManager.CustomError) => void): this;

    on(event: 'updateListingsSuccessful', handler: (response: { updated: number; errors: [] }) => void): this;

    on(event: 'deleteListingsError', handler: (err: ListingManager.CustomError) => void): this;

    on(event: 'deleteListingsSuccessful', handler: (response: Record<string, unknown>) => void): this;

    on(event: 'massDeleteListingsError', handler: (err: ListingManager.CustomError) => void): this;

    on(event: 'massDeleteListingsSuccessful', handler: (response: Record<string, unknown>) => void): this;

    on(event: 'deleteArchivedListingError', handler: (err: ListingManager.CustomError) => void): this;

    on(event: 'deleteArchivedListingSuccessful', handler: (response: boolean) => void): this;

    on(event: 'massDeleteArchiveError', handler: (err: ListingManager.CustomError) => void): this;

    on(event: 'massDeleteArchiveSuccessful', handler: (response: Record<string, unknown>) => void): this;
}

declare namespace ListingManager {
    interface Item {
        defindex: number;
        quality: number;
        craftable?: boolean;
        killstreak?: number;
        australium?: boolean;
        effect?: number;
        festive?: boolean;
        paintkit?: number;
        wear?: number;
        quality2?: number;
        craftnumber?: number;
        crateseries?: number;
        target?: number;
        output?: number;
        outputQuality?: number;
    }

    interface CreateListing {
        id?: string;
        sku?: string;
        intent: 0 | 1;
        quantity?: number;
        details?: string;
        promoted?: 0 | 1;
        currencies: TF2Currencies;
        priority?: number;
        force?: boolean;
    }

    interface RemoveListing {
        id?: string;
        sku?: string;
        intent: 0 | 1;
    }

    interface UpdateListing {
        details: string;
        currencies: TF2Currencies;
    }

    interface CustomError {
        message: string;
        status: number;
        data: Record<string, any>;
    }

    interface CreateListingDTO {
        listing: BpCreateListingDTO;
        priority?: number;
        force?: boolean;
    }

    type BpCreateListingDTO = {
        currencies: TF2Currencies;
        offers?: 0 | 1;
        buyout?: 0 | 1;
        promoted?: 0 | 1;
        details?: string;
    } & ({ id: string } | { item: Record<string, unknown> });

    type DesiredListing = {
        hash: string;
        id: string | null;
        updatedAt: number;
        lastAttemptedAt?: number;
        error?: string;
    } & CreateListingDTO;

    type RemoveListingDTO =
        | {
              hash: string;
          }
        | {
              id: string;
          }
        | {
              item: Record<string, unknown>;
          };

    export class Listing {
        id: string;

        appid: number;

        steamid: SteamID;

        intent: 0 | 1;

        item: Record<string, unknown>;

        sku: string;

        details: string;

        currencies: TF2Currencies;

        offers: boolean;

        buyout: boolean;

        promoted: 0 | 1;

        created: number;

        bump: number;

        archived: boolean;

        status: string;

        v2: boolean;

        getSKU(): string;

        getItem(): Item;

        update(properties: {
            currencies?: TF2Currencies;
            details?: string;
            // quantity?: number;
        }): void;

        remove(): void;
    }

    export class Manager {
        constructor(url: string);

        async healthCheck(): Promise<string>;

        async addToken(steamid: string, token: string): Promise<null>;

        async startAgent(
            steamid: string,
            agent?: string
        ): Promise<{ steamid64: string; userAgent: string | null; updatedAt: number }>;

        async stopAgent(steamid: string): Promise<null>;

        async startInventoryRefresh(steamid: string): Promise<null>;

        async refreshListingLimits(steamid: string): Promise<null>;

        async getListingLimits(
            steamid: string
        ): Promise<{ cap: number; used: number; promoted: number; updatedAt: number }>;

        async addDesiredListings(steamid: string, listings: CreateListingDTO[]): Promise<DesiredListing[]>;

        async removeDesiredListing(steamid: string, listings: RemoveListingDTO[]): Promise<null>;

        async getDesiredListings(steamid: string): Promise<DesiredListing[]>;
    }
}

export = ListingManager;
