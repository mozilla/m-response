import { getSupportedLanguages } from './config'

export const getProfile = state => {
    const { profile } = state.auth
    const spokenLangauges = JSON.parse(profile.user_metadata.languages)
    
    const languages = getSupportedLanguages(state)
        .filter(({ id, display_name }) => {
            let speaksLanguage = false
            spokenLangauges.map(code => {
                if (code == id) {
                    speaksLanguage = true
                }
            })
            return speaksLanguage
        })

    return {
        name: profile.user_metadata.name,
        picture: profile.picture,
        email: profile.email,
        languages,
        karma: {
            responses: {
                karmaValue: 0,
                responsesCount: 0
            },
            moderations: {
                karmaValue: 0,
                moderationsCount: 0
            }
        }
    }
}
