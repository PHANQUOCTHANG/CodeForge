import { Link } from "react-router-dom";
import "./NotFound.scss";

const NotFound = () => {
  return (
    <section className="page_404">
      <div className="container">
        <div className="content">
          <div className="four_zero_four_bg">
            <h1>404</h1>
          </div>

          <div className="contant_box_404">
            <h3>Look like you're lost</h3>
            <p>The page you are looking for is not available!</p>
            <Link to="/" className="link_404">
              Go to Home
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NotFound;
