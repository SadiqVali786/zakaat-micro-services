import { Tailwind, Button } from "@react-email/components";

export const Email = ({ url }: { url: string }) => {
  return (
    <Tailwind>
      <Button href={url} className="px-3 py-2 font-medium leading-4 text-white">
        Click me
      </Button>
    </Tailwind>
  );
};
