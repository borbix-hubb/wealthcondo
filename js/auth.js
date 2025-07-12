async function login(email, password) {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        });

        if (error) throw error;

        const user = data.user;
        const role = await getUserRole(user.id);

        if (role === 'admin') {
            window.location.href = 'index.html';
        } else if (role === 'customer') {
            window.location.href = 'customer.html';
        } else if (role === 'technician') {
            window.location.href = 'technician.html';
        } else {
            window.location.href = 'customer.html';
        }
    } catch (error) {
        console.error('Login error:', error);
        throw new Error('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
    }
}

async function logout() {
    try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        window.location.href = 'login.html';
    } catch (error) {
        console.error('Logout error:', error);
    }
}

async function checkAuthStatus() {
    const user = await checkAuth();
    if (!user) {
        if (window.location.pathname.split('/').pop() !== 'login.html') {
            window.location.href = 'login.html';
        }
        return null;
    }
    return user;
}

document.addEventListener('DOMContentLoaded', async () => {
    const currentPage = window.location.pathname.split('/').pop();
    
    if (currentPage !== 'login.html') {
        const user = await checkAuthStatus();
        if (user) {
            const userEmailElement = document.getElementById('userEmail');
            if (userEmailElement) {
                userEmailElement.textContent = user.email;
            }
            
            await redirectBasedOnRole();
        }
    }
});

window.login = login;
window.logout = logout;