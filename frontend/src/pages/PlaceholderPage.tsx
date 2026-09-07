interface PlaceholderPageProps {
  title: string;
  description: string;
}

const PlaceholderPage = ({
  title,
  description,
}: PlaceholderPageProps) => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-slate-900">
        {title}
      </h1>

      <p className="mt-1 text-sm text-slate-500">
        {description}
      </p>

      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-slate-500">
          Bu modül sonraki fazda geliştirilecektir.
        </p>
      </div>
    </div>
  );
};

export default PlaceholderPage;