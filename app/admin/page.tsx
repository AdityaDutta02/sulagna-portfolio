import { redirect } from 'next/navigation';

export default function AdminRoot(): never {
  redirect('/admin/inbox');
}
