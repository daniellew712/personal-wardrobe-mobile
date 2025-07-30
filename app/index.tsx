import { Redirect } from 'expo-router'
import { useAuth } from '../src/contexts/AuthContext'
import { LoadingScreen } from '../components'
import { ROUTES } from '../src/lib/constants'

export default function Index() {
    const { user, loading } = useAuth()

    if (loading) {
        return <LoadingScreen message="Loading your wardrobe..." />
    }

    if (!user) {
        return <Redirect href="/welcome" />
    }

    return <Redirect href={ROUTES.HOME} />
}
