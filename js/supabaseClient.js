const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function checkAuth() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
}

async function getUserRole(userId) {
    const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .single();
    
    if (error) {
        console.error('Error fetching user role:', error);
        return null;
    }
    
    return data?.role || 'customer';
}

async function redirectBasedOnRole() {
    const user = await checkAuth();
    if (!user) {
        window.location.href = 'login.html';
        return;
    }

    const role = await getUserRole(user.id);
    const currentPage = window.location.pathname.split('/').pop();

    if (role === 'admin' && currentPage !== 'index.html' && currentPage !== 'invoice.html') {
        window.location.href = 'index.html';
    } else if (role === 'customer' && currentPage !== 'customer.html') {
        window.location.href = 'customer.html';
    } else if (role === 'technician' && currentPage !== 'technician.html') {
        window.location.href = 'technician.html';
    }
}

window.supabase = supabase;
window.checkAuth = checkAuth;
window.getUserRole = getUserRole;
window.redirectBasedOnRole = redirectBasedOnRole;