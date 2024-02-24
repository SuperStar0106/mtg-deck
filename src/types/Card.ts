export interface CardProps {
  card: any;
  isDeckFull: boolean;
  count: number;
  btnText: string;
  onClick: () => void;
}