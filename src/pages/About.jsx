import { Link } from 'react-router-dom'
import Icon from '../components/Icons'

const values = [
  { icon: 'users', title: 'Talent first', text: 'We champion independent creators and give their work the spotlight it deserves.' },
  { icon: 'shield', title: 'Clarity & trust', text: 'Transparent packages, real portfolios and honest reviews help clients decide with confidence.' },
  { icon: 'zap', title: 'Simple by design', text: 'Great tools should feel effortless, from discovery to the first conversation.' },
]

export default function About() {
  return (
    <div>
      <section className="bg-gradient-to-b from-brand-50 to-white py-16">
        <div className="container-page max-w-3xl text-center">
          <span className="chip mb-4">About CreatorSpace</span>
          <h1 className="text-4xl font-extrabold sm:text-5xl">A home for creative talent and the clients who need it</h1>
          <p className="mt-5 text-lg text-ink-500">
            CreatorSpace connects designers, developers, editors, writers and marketers with people who have projects worth building. Creators showcase their portfolios and list services; clients explore, save favourites and send inquiries in minutes.
          </p>
        </div>
      </section>
      <section className="container-page grid gap-6 py-16 md:grid-cols-3">
        {values.map((v) => (
          <div key={v.title} className="card p-7">
            <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600"><Icon name={v.icon} /></span>
            <h2 className="text-lg font-bold">{v.title}</h2>
            <p className="mt-2 text-sm text-ink-500">{v.text}</p>
          </div>
        ))}
      </section>
      <section className="container-page pb-20">
        <div className="card flex flex-col items-center gap-4 p-10 text-center">
          <h2 className="text-2xl font-extrabold">About this project</h2>
          <p className="max-w-2xl text-ink-500">
            CreatorSpace is a frontend-only demo built with React, Tailwind CSS, React Router and LocalStorage. All creators, services and reviews are sample data, and nothing is sent to a server.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/services" className="btn-primary">Explore Services</Link>
            <Link to="/dashboard" className="btn-secondary">Try the Creator Dashboard</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
