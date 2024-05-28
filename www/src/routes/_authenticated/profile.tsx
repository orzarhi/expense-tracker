import { Button } from '@/components/ui/button';
import { userQueryOptions } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/profile')({
    component: Profile
})

function Profile() {
    const { data, error, isPending } = useQuery(userQueryOptions)

    if (isPending) {
        return <div>Loading...</div>
    }

    if (error) {
        return <div>Not loggedIn</div>
    }

    const { id, sub, picture, updated_at, preferred_username, ...user } = data.user;

    return (
        <div className='p-2'>
            <pre>
                {JSON.stringify(user, null, 2)}
            </pre>

            <Button className='mt-8 w-28' asChild>
                <a href="api/logout">
                    Logout 🚪
                </a>
            </Button>

        </div>
    )
}