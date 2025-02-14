<template>
    <boxed-layout :wide="true" slotClass="view-account">
        <header class="view-account__header">
            <img src="../../assets/images/logo.svg" width="100" height="100" alt="Contao Logo" />
            <p class="view-account__product">
                <strong>{{ $t('ui.account.welcome') }}</strong>
                Contao Manager @package_version@
            </p>
            <p>
                <i18n :tag="false" path="ui.account.intro1">
                    <template #readTheManualToGetStarted>
                        <i18n tag="strong" path="ui.account.introGetStarted">
                            <template #readTheManual><a href="https://docs.contao.org/manual/de/installation/contao-manager/" target="_blank">{{ $t('ui.account.introManual') }}</a></template>
                        </i18n>
                    </template>
                </i18n>
                <br><br>
                <i18n :tag="false" path="ui.account.intro2">
                    <template #ourGithubIssues><a href="https://github.com/contao/contao-manager/issues" target="_blank">{{ $t('ui.account.introIssues') }}</a></template>
                </i18n>
            </p>
        </header>

        <main class="view-account__form">
            <form @submit.prevent="createAccount">
                <h1 class="view-account__headline">{{ $t('ui.account.headline') }}</h1>
                <p class="view-account__description">{{ $t('ui.account.description') }}</p>

                <fieldset class="view-account__fields">
                    <text-field
                        ref="username" name="username"
                        :label="$t('ui.account.username')"
                        :disabled="installing"
                        required
                        @keyup="validate"
                        v-model="username"
                    />
                    <text-field
                        ref="password" name="password" type="password"
                        :label="$t('ui.account.password')" :placeholder="$t('ui.account.passwordPlaceholder')"
                        :disabled="installing"
                        required pattern=".{8,}"
                        :error="errors.password" @blur="validatePassword"
                        @keyup="validate"
                        v-model="password"
                    />

                    <loading-button submit color="primary" :disabled="!valid" :loading="installing">{{ $t('ui.account.submit') }}</loading-button>
                </fieldset>
            </form>
        </main>

        <div class="clearfix"></div>
        <aside class="view-account__contribute">
            <p>
                {{ $t('ui.account.contribute1') }}<br>
                <i18n :tag="false" path="ui.account.contribute2">
                    <template #donate><a href="https://to.contao.org/donate" target="_blank">{{ $t('ui.account.contributeDonate') }}</a></template>
                </i18n>
            </p>
        </aside>
    </boxed-layout>
</template>

<script>
    import views from '../../router/views';

    import BoxedLayout from '../layouts/Boxed';
    import TextField from '../widgets/TextField';
    import LoadingButton from 'contao-package-list/src/components/fragments/LoadingButton';

    export default {
        components: { BoxedLayout, TextField, LoadingButton },

        data: () => ({
            username: '',
            password: '',

            errors: {
                password: '',
            },

            installing: false,
            valid: false,
        }),

        methods: {
            validate() {
                this.valid = this.$refs.username.checkValidity()
                    && this.$refs.password.checkValidity();
            },

            validatePassword() {
                this.errors.password = null;

                if (this.password === '') {
                    return;
                }

                if (this.password.length < 8) {
                    this.errors.password = this.$t('ui.account.passwordLength');
                }
            },

            createAccount() {
                if (!this.valid) {
                    return;
                }

                this.installing = true;

                this.$store.dispatch(
                    'auth/login',
                    {
                        username: this.username,
                        password: this.password,
                    },
                ).then(
                    (success) => {
                        if (success) {
                            this.$store.commit('setView', views.BOOT);
                        } else {
                            this.$store.commit('apiError');
                        }
                    },
                );
            },
        },

        mounted() {
            if (this.$refs.username) {
                this.$refs.username.focus();
            }
        },
    };
</script>

<style rel="stylesheet/scss" lang="scss">
    @import "~contao-package-list/src/assets/styles/defaults";

    .view-account {
        &__header {
            max-width: 280px;
            margin-left: auto;
            margin-right: auto;
            padding: 40px 0;
            text-align: center;
        }

        &__product {
            margin-top: 15px;
            margin-bottom: 40px;
            font-weight: $font-weight-bold;

            strong {
                display: block;
                margin-bottom: 10px;
                font-size: 54px;
                font-weight: $font-weight-light;
                line-height: 1;
            }
        }

        &__headline {
            margin-bottom: .5em;
            font-size: 18px;
            font-weight: $font-weight-bold;
            line-height: 30px;
        }

        &__description {
            margin-bottom: 1em;
            text-align: justify;
        }

        &__form {
            position: relative;
            max-width: 280px;
            margin: 0 auto;

            .widget-text {
                margin-top: 10px;

                label {
                    display: block;
                    padding-bottom: 5px;
                }
            }

            .widget-button {
                margin-top: 1.5em;
            }
        }

        &__contribute {
            max-width: 250px;
            margin: 80px auto 0;
            font-size: 12px;
            text-align: center;

            br {
                display: none;
            }
        }

        @include screen(960) {
            padding-top: 100px;

            &__header {
                float: left;
                width: 470px;
                max-width: none;
                padding: 0 60px;
            }

            &__form {
                float: left;
                width: 370px;
                max-width: none;
                margin: 20px 50px 0;

                .widget-text label {
                    float: left;
                    width: 120px;
                    padding-top: 10px;
                    font-weight: $font-weight-medium;
                }

                input[type=text],
                input[type=password],
                select {
                    width: 250px !important;
                }

                .widget-button {
                    width: 250px;
                    margin-left: 120px;
                }
            }

            &__contribute {
                max-width: 840px;

                br {
                    display: block;
                }
            }
        }
    }
</style>
