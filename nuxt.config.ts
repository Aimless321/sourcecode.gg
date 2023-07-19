// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindTypography from "@tailwindcss/typography";
import defaultTheme from "tailwindcss/defaultTheme";

export default defineNuxtConfig({
    extends: '@nuxt-themes/typography',
    devtools: {enabled: true},
    modules: [
        '@nuxtjs/tailwindcss',
        '@nuxt/content'
    ],
    content: {
        navigation: {
            fields: ['title', 'description', 'publishedAt']
        },
        highlight: {
            theme: {
                default: 'github-light',
                dark: 'github-dark'
            }
        }
    },
    app: {
        head: {
            link: [
                {
                    rel: 'stylesheet',
                    href: 'https://rsms.me/inter/inter.css'
                }
            ],
            script: [{
                innerHTML: 'if (localStorage.theme === \'dark\' || (!(\'theme\' in localStorage) && window.matchMedia(\'(prefers-color-scheme: dark)\').matches)) {\n' +
                    '  document.documentElement.classList.add(\'dark\')\n' +
                    '} else {\n' +
                    '  document.documentElement.classList.remove(\'dark\')\n' +
                    '}'
            }]
        }
    },
    tailwindcss: {
        config: {
            darkMode: 'class',
            plugins: [tailwindTypography],
            theme: {
                extend: {
                    fontFamily: {
                        sans: ['Inter var', ...defaultTheme.fontFamily.sans],
                    },
                    typography: {
                        DEFAULT: {
                            css: {
                                'max-width': 'unset',
                                pre: {
                                    'background-color': 'unset'
                                },
                                'code::before': {
                                    content: 'none',
                                },
                                'code::after': {
                                    content: 'none',
                                },
                            }
                        }
                    }
                },
            }
        }
    }
})
