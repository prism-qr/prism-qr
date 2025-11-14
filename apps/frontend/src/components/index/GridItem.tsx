interface GridItemProps {
  area: string;
  icon?: React.ReactNode;
  title: string;
  description: React.ReactNode;
  iconBgColor?: string;
  iconBorderColor?: string;
}

export const GridItem = ({
  area,
  icon,
  title,
  description,
  iconBgColor = "bg-green-600/10",
  iconBorderColor = "border-green-900/80",
}: GridItemProps) => {
  return (
    <li className={`min-h-[14rem] list-none ${area}`}>
      <div className="group relative h-full rounded-2xl border border-neutral-800 bg-gradient-to-br from-neutral-900/50 to-neutral-900/30 p-6 backdrop-blur-sm transition-all duration-300 hover:border-neutral-700 hover:shadow-xl hover:shadow-purple-500/10">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur" />
        
        <div className="relative flex h-full flex-col justify-between gap-6">
          <div className="relative flex flex-1 flex-col justify-between gap-3">
            {icon && (
              <div
                className={`w-fit rounded-lg border ${iconBorderColor} ${iconBgColor} p-2`}
              >
                {icon}
              </div>
            )}
            <div className="space-y-3">
              <h3 className="font-sans text-xl font-semibold text-white md:text-2xl group-hover:text-purple-300 transition-colors">
                {title}
              </h3>
              <div className="font-sans text-sm text-neutral-400 md:text-base">
                {description}
              </div>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
};

