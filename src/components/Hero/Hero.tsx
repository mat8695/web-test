import Button from "@/components/Button";
import styles from "./Hero.module.css";

function HeartIcon() {
  return (
    <svg
      className={styles.heart}
      viewBox="0 0 20 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M10 18C10.6536 17.6444 19.6079 12.8793 19.9869 6.50693C20.0523 5.36901 19.9216 3.15005 18.4314 1.48583C17.4902 0.433247 16.3137 0.177214 15.8954 0.0918696C12.7974 -0.548214 10.3007 2.48152 10 2.80867C9.71242 2.48152 7.20261 -0.562439 4.10456 0.0918696C3.68626 0.177214 2.50979 0.433247 1.56861 1.48583C0.0784135 3.13582 -0.0523058 5.36901 0.0130538 6.50693C0.392139 12.8793 9.3464 17.6586 10 18Z"
        fill="#de2228"
      />
    </svg>
  );
}

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.topBar} aria-label="KAT is a designer">
        <span>KAT</span>
        <span className={styles.topBarWord}>is</span>
        <span className={styles.topBarWord}>a</span>
        <span>designer</span>
      </div>

      <h1 className={styles.tagline}>
        with a special love for visual communication and turning chaos into clarity.
      </h1>

      <div className={styles.bottomBar}>
        <div className={styles.bottomBarLeft}>
          <Button href="/works">works</Button>
        </div>
        <HeartIcon />
        <div className={styles.bottomBarRight}>
          <Button href="/about">read about KAT</Button>
        </div>
      </div>
    </section>
  );
}
