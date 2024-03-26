type Props = {
  percent: number;
};

export default function TotalProgressBar({ percent }: Props) {
  return (
    <div className="relative w-full">
      {/* Container div representing the complete bar */}
      <div className="relative h-10 rounded-full  bg-blue-200 opacity-50"></div>

      {/* Filled portion of the bar */}
      <div
        className="absolute left-0 top-0 rounded-full  bg-gradient-to-r from-blue-500 to-blue-700"
        style={{ width: `${percent}%`, height: "100%" }}
      />
    </div>
  );
}
