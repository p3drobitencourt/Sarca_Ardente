import { Flame, Loader2, type LucideProps } from 'lucide-react';

export const Icons = {
  logo: (props: LucideProps) => (
    <Flame {...props} />
  ),
  spinner: (props: LucideProps) => (
    <Loader2 {...props} />
  ),
};
