import React from 'react';
import { redirect } from 'next/navigation';

export default function StorePage() {
  // We could list avaliable wine stores here, but for the moment
  // there is only one store in use
  // so we just redirect to it for now.
  redirect('/store/5');
}