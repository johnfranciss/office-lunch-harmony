
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-food-neutral-light p-4">
      <div className="text-center space-y-4 max-w-md">
        <div className="text-8xl text-food-orange font-bold">404</div>
        <h1 className="text-3xl font-bold">Page not found</h1>
        <p className="text-muted-foreground">
          Sorry, we couldn't find the page you're looking for: <span className="font-mono">{location.pathname}</span>
        </p>
        <div className="pt-6">
          <Button 
            onClick={() => navigate("/")}
            className="bg-food-orange hover:bg-food-orange-dark"
          >
            Go to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
