function Features() {
  const features = [
    {
      icon: "🚌",
      title: "Easy Booking",
      text: "Book your bus ticket in just a few clicks."
    },
    {
      icon: "⭐",
      title: "Loyalty Points",
      text: "Earn points every time you travel with BMB."
    },
    {
      icon: "🗺️",
      title: "Popular Routes",
      text: "Discover popular destinations and best routes."
    },
    {
      icon: "🔒",
      title: "Secure Payment",
      text: "Your payments are safe and secure with BMB."
    }
  ];

  return (
    <section className="features-section">

      {features.map((feature) => (
        <div className="feature-card" key={feature.title}>

          <div className="feature-icon">
            {feature.icon}
          </div>

          <div>
            <h3>{feature.title}</h3>
            <p>{feature.text}</p>
          </div>

        </div>
      ))}

    </section>
  );
}

export default Features;