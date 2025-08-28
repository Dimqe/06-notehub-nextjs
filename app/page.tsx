import css from './page.module.css';

export default function HomePage() {
  return (
    <main>
      <div className={css.container}>
        <h1 className={css.title}>Welcome to NoteHub</h1>
        <p className={css.description}>
          NoteHub is a simple and efficient application designed for managing personal notes...
        </p>
        <p className={css.description}>
          The app provides a clean interface for writing, editing, and browsing notes...
        </p>
      </div>
    </main>
  );
}
