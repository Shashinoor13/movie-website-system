import { NextResponse } from 'next/server';
import supabase from '@/app/(config)/supabase';
import { useUser } from '@clerk/nextjs';

export async function GET(request: Request) {
    const { user, isLoaded } = useUser();
    if (user) {
        let supabaseQuery = supabase.from('users').select('*').eq('id', user.id);
        const { data, error } = await supabaseQuery;
        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        if (data.length === 0) {
            return NextResponse.redirect('/signup');
        }
        return NextResponse.redirect('/home');
    }
}