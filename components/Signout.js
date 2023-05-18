import {supabase, refreshSession} from '@/helpers/supabaseHelpers';
export default function Signout(){
    async function signout(){
        await refreshSession(supabase);
        await supabase.auth.signOut();
        window.location.reload();
    }
    return(
        <div>
            <button onClick={signout} > log out </button>
        </div>
    )
}