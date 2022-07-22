import Vue from 'vue';

export default {
    namespaced: true,

    state: {
        cache: null,
        loading: false,
        supported: false,
        totalMigrations: 0,
        totalSchemaUpdates: 0,
    },

    getters: {
        totalChanges: state => state.totalMigrations + state.totalSchemaUpdates,
    },

    mutations: {
        setLoading(state, value) {
            state.loading = !!value;
        },

        setCache(state, response) {
            state.cache = response;
            state.supported = false;
            state.totalMigrations = 0;
            state.totalSchemaUpdates = 0;
            state.loading = false;

            if (response.status === 200) {
                state.supported = true;

                if (response.body.status.type === 'schema') {
                    state.totalSchemaUpdates = response.body.status.total;
                } else if (response.body.status.type === 'migration') {
                    state.totalMigrations = response.body.status.total;
                }
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

        set(store, url) {
            return Vue.http.post('api/server/database', { url }).then(
                response => response,
                response => response
            );
        }
    },
};