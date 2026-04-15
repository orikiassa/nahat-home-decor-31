export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-secondary/50 py-10">
      <div className="mx-auto max-w-6xl px-4 text-center">
        <p className="font-display text-lg font-bold text-foreground">נחת Home</p>
        <p className="mt-2 text-sm text-muted-foreground">
          עיצוב הבית שלך, בנחת ובסטייל
        </p>
        <p className="mt-4 text-xs text-muted-foreground">
          © {new Date().getFullYear()} נחת Home. כל הזכויות שמורות.
        </p>
      </div>
    </footer>
  );
}
