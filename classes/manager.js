const axios = require('axios').default;

export class Manager {
    /**
     * Creates a new instance
     * @param {String} url url of bptf-manager
     */
    constructor(url) {
        this.url = url;

        this.axios = axios.create({
            baseURL: this.url
        });
    }

    async healthCheck() {
        return this.axios({
            method: 'GET',
            url: '/metrics'
        });
    }

    async addToken(steamid, token) {
        return this.axios({
            method: 'POST',
            url: '/tolens',
            data: {
                steamid64: steamid,
                value: token
            }
        });
    }

    async startAgent(steamid, agent) {
        return this.axios({
            method: 'POST',
            url: `/agents/${steamid}/register`,
            data: {
                userAgent: agent
            }
        });
    }

    async stopAgent(steamid) {
        return this.axios({
            method: 'POST',
            url: `/agents/${steamid}/unregister`,
            data: {
                userAgent: agent
            }
        });
    }

    async startInventoryRefresh(steamid) {
        return this.axios({
            method: 'POST',
            url: `/inventories/${steamid}/refresh`
        });
    }

    async refreshListingLimits(steamid) {
        return this.axios({
            method: 'POST',
            url: `/listings/${steamid}/limits`
        });
    }

    async getListingLimits(steamid) {
        return this.axios({
            method: 'GET',
            url: `/listings/${steamid}/limits`
        });
    }

    async addDesiredListings(steamid, listings) {
        return this.axios({
            method: 'POST',
            url: `/listings/${steamid}/desired`,
            data: listings
        });
    }

    async removeDesiredListings(steamid, listings) {
        return this.axios({
            method: 'DELETE',
            url: `/listings/${steamid}/desired`,
            data: listings
        });
    }

    async getDesiredListings(steamid) {
        return this.axios({
            method: 'GET',
            url: `/listings/${steamid}/desired`
        });
    }
}
