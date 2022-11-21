// Globale Styles werden auf allen Seiten geladen
import '../sass/style.scss';

/* Man kann mit Next Fonts hochoptimiert nutzen, Google Fonts zudem
Datenschutzkonform, da die Dateien von Google auf den eigenen
Server kopiert werden. Man sollte die Dokumentation aber sorgfältig
lesen. Alternativ kann man auch die Font-Dateien selbst in den
public-Ordner kopieren und wie normal im CSS verwenden.
https://nextjs.org/docs/basic-features/font-optimization
*/
import { Karla, Rubik, Rubik_Mono_One } from '@next/font/google';
const karla = Karla({ subsets: ['latin'] });
const rubik = Rubik({ subsets: ['latin'] });
// Bei nicht-variablen Fonts muss man weight und ggf. style angeben
const rubikMonoOne = Rubik_Mono_One({ subsets: ['latin'], weight: '400' });

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <style jsx global>{`
        html {
          font-family: ${karla.style.fontFamily};
        }
        h1 {
          font-family: ${rubikMonoOne.style.fontFamily};
        }
        h2,
        h3,
        h4,
        h5,
        h6 {
          font-family: ${rubik.style.fontFamily};
        }
      `}</style>
      <Component {...pageProps} />
    </>
  );
}
