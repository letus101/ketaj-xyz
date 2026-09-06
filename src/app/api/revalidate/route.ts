import { revalidatePath, revalidateTag } from 'next/cache';
import { type NextRequest, NextResponse } from 'next/server';
import { parseBody } from 'next-sanity/webhook';

interface WebhookBody {
  _type: string;
  slug?: string;
}

export async function POST(req: NextRequest) {
  try {
    const { isValidSignature, body } = await parseBody<WebhookBody>(
      req,
      process.env.SANITY_REVALIDATE_SECRET,
    );

    if (!isValidSignature) {
      return NextResponse.json({ message: 'Invalid signature' }, { status: 401 });
    }

    if (!body?._type) {
      return NextResponse.json({ message: 'Bad request: missing _type' }, { status: 400 });
    }

    // Revalidate the content type tag (e.g., all post listings)
    revalidateTag(body._type);

    // Revalidate the homepage (post index)
    revalidatePath('/');

    // Revalidate the about page when the about document changes
    if (body._type === 'about') {
      revalidatePath('/about');
    }

    // Revalidate the specific post page if a slug is provided
    if (body.slug) {
      revalidatePath(`/posts/${body.slug}`);
      revalidateTag(`${body._type}:${body.slug}`);
    }

    return NextResponse.json({
      revalidated: true,
      tags: [body._type, body.slug ? `${body._type}:${body.slug}` : null].filter(Boolean),
      now: Date.now(),
    });
  } catch (err) {
    console.error('Revalidation webhook error:', err);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
