import Vue from 'vue';

export default {
    namespaced: true,

    state: {
        cache: null,
        loading: false,
        supported: null,
        status: null,
        pattern: null,
        url: null,
    },

    getters: {
        totalMigrations: state => (!!state.status && state.status.type === 'migration') ? state.status.total : 0,
        totalSchemaUpdates: state => (!!state.status && state.status.type === 'schema') ? state.status.total : 0,
        hasError: state => !!state.status && (state.status.type === 'error' || state.status.type === 'problem'),
        hasWarning: state => !!state.status && state.status.warnings > 0,
        hasChanges: (state, getters) => !!getters.totalMigrations || !!getters.totalSchemaUpdates,
        totalChanges: (state, getters) => getters.totalMigrations + getters.totalSchemaUpdates,
    },

    mutations: {
        setLoading(state, value) {
            state.loading = !!value;
        },

        setCache(state, response) {
            state.cache = response;
            state.loading = false;
            state.supported = response ? false : null;
            state.status = null;
            state.url = null;

            if (response && response.status === 200) {
                state.supported = true;
                state.status = response.body.status;
                state.pattern = response.body.pattern;
                state.url = response.body.url;
            }
        },
    },

    actions: {
        get({ state, commit }, cache = true) {
            if (cache && state.cache) {
                return new Promise((resolve) => {
                    resolve(state.cache);
                });
            }

            const handle = (response) => {
                commit('setCache', response);

                return response;
            };

            commit('setLoading', true);

            return Vue.http.get('api/server/database').then(handle, handle);
        },

        set({ commit }, url) {
            const handle = (response) => {
                commit('setCache', response);

                return response;
            };

            commit('setLoading', true);

            return Vue.http.post('api/server/database', { url }).then(handle, handle);
        },
    },
};
