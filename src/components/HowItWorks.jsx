import "./HowItWorks.css";

export default function HowItWorks() {
  return (
    <section className="how-container" id="how">
      <h2 className="how-title">How FinPlay Works</h2>
      <p className="how-subtitle">
        Simple 4-step journey to financial mastery
      </p>

      <div className="timeline">

        <div className="timeline-item left">
          <div className="content">
            <h3>Sign Up & Assessment</h3>
            <p>
              Create free account. Take 5-min assessment to identify your
              financial knowledge level.
            </p>
          </div>
          <div className="circle">1</div>
        </div>

        <div className="timeline-item right">
          <div className="content">
            <h3>Choose Learning Path</h3>
            <p>
              Select from beginner, intermediate, or advanced tracks based on
              your goals.
            </p>
          </div>
          <div className="circle">2</div>
        </div>

        <div className="timeline-item left">
          <div className="content">
            <h3>Play & Learn</h3>
            <p>
              Complete interactive games and simulations. Earn points and
              unlock achievements.
            </p>
          </div>
          <div className="circle">3</div>
        </div>

        <div className="timeline-item right">
          <div className="content">
            <h3>Track Progress</h3>
            <p>
              Monitor improvement across 15+ financial skills. Get
              personalized recommendations.
            </p>
          </div>
          <div className="circle">4</div>
        </div>

      </div>
    </section>
  );
}