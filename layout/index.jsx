import Head from 'next/head'
// import Header from '@/components/header'
// import Footer from '@/components/footer'


export default function Layout({ children, metaTitle, metaDescription }) {
  return <div>
    <Head>
        <title>To Do List - {metaTitle}</title>
        <meta name="description" content={metaDescription || "Generated by create next app"} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
    </Head>
    <main>
        {children}
    </main>
  </div>
}