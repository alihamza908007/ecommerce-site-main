import { Card, CardBody } from "@/components/common";

interface StatCardProps {
  label: string;
  value: string | number;
  color?: "emerald" | "violet" | "amber" | "rose";
}

const colorMap = {
  emerald: "from-emerald-500 to-teal-500 text-white",
  violet: "from-violet-600 to-purple-600 text-white",
  amber: "from-amber-500 to-orange-500 text-white",
  rose: "from-rose-500 to-pink-500 text-white",
};

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  color = "violet",
}) => {
  return (
    <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105">
      <CardBody className={`bg-gradient-to-br ${colorMap[color]} rounded-lg`}>
        <p className="text-xs uppercase tracking-wide font-semibold opacity-90">
          {label}
        </p>
        <p className="mt-3 text-3xl font-bold">{value}</p>
      </CardBody>
    </Card>
  );
};
