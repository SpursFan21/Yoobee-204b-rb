import { Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import StarRating from "./StarRating";

interface ReviewProps {
  name?: string;
  photoUrl?: string;
  rating: number;
  comment?: string;
}


export default function UserReview({
  name,
  photoUrl,
  rating,
  comment,
}: ReviewProps) {
  const initials = name
    ? name
        .split(" ")
        .map((n) => n[0])
        .join("")
    : "?";

  return (
    <div className="bg-card flex flex-col items-start gap-4 rounded-lg p-4 w-full shadow-sm sm:flex-row">
      <Avatar className="h-16 w-16">
        <AvatarImage src={photoUrl} alt={name} />
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-center">
          <h3 className="text-lg font-semibold">{name}</h3>
          <StarRating rating={rating} />
        </div>
        <p className="text-muted-foreground">
          {comment ?? "No comment provided."}
        </p>
      </div>
    </div>
  );
}
