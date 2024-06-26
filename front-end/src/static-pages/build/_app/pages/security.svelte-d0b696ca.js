import {
  S as Ue,
  i as Ge,
  s as Me,
  e as a,
  t as b,
  k as d,
  c as r,
  a as i,
  h as $,
  d as o,
  m,
  b as n,
  g as je,
  I as e,
  j as Le,
  J as Ce,
  w as S,
  x as _,
  H as Ne,
  y as I,
  q as D,
  o as k,
  B as A,
} from "../chunks/vendor-dc0336cb.js";
function Je(x) {
  let t, l, p, w, u, f;
  return {
    c() {
      (t = a("div")),
        (l = a("div")),
        (p = b(x[0])),
        (w = d()),
        (u = a("div")),
        (f = b(x[1])),
        this.h();
    },
    l(y) {
      t = r(y, "DIV", { class: !0 });
      var h = i(t);
      l = r(h, "DIV", { class: !0 });
      var F = i(l);
      (p = $(F, x[0])),
        F.forEach(o),
        (w = m(h)),
        (u = r(h, "DIV", { class: !0 }));
      var K = i(u);
      (f = $(K, x[1])), K.forEach(o), h.forEach(o), this.h();
    },
    h() {
      n(l, "class", "font-bold text-lg tablet:text-2xl"),
        n(
          u,
          "class",
          "font-normal text-base tablet:text-lg whitespace-pre-line"
        ),
        n(
          t,
          "class",
          "security-facts-item flex flex-col space-y-3 tablet:space-y-4"
        );
    },
    m(y, h) {
      je(y, t, h), e(t, l), e(l, p), e(t, w), e(t, u), e(u, f);
    },
    p(y, [h]) {
      h & 1 && Le(p, y[0]), h & 2 && Le(f, y[1]);
    },
    i: Ce,
    o: Ce,
    d(y) {
      y && o(t);
    },
  };
}
function Fe(x, t, l) {
  let { summary: p } = t,
    { message: w } = t;
  return (
    (x.$$set = (u) => {
      "summary" in u && l(0, (p = u.summary)),
        "message" in u && l(1, (w = u.message));
    }),
    [p, w]
  );
}
class P extends Ue {
  constructor(t) {
    super();
    Ge(this, t, Fe, Je, Me, { summary: 0, message: 1 });
  }
}
function Ke(x) {
  let t,
    l,
    p,
    w,
    u,
    f,
    y,
    h,
    F,
    K,
    ce,
    E,
    g,
    de,
    me,
    ue,
    pe,
    fe,
    he,
    ye,
    ge,
    Q,
    q,
    We,
    ve,
    X,
    we,
    be,
    v,
    O,
    $e,
    H,
    xe,
    z,
    Se,
    L,
    _e,
    V,
    C,
    N,
    Ie,
    U,
    De,
    W,
    G,
    ke,
    M,
    Ae,
    Y,
    j,
    Pe,
    T,
    Z,
    Ee,
    Ve,
    ee,
    J,
    Te,
    ae;
  return (
    (O = new P({
      props: {
        summary: "Thoughtfully collect information that we absolutely need to",
        message:
          "SalusConnect only collects information that we consider essential in delivering a smooth and reliable service through the platform. Any information that is not considered essential to deliver the core user experience either is not collected or is made optional for users to decide if they want to provide it.",
      },
    })),
    (H = new P({
      props: {
        summary:
          "Pay significant attention to protect your account information",
        message: `SalusConnect uses an industry leading SHA 512 encryption algorithm to store user passwords. In addition, we have deployed a One-way hash system to store user passwords. Using this we can only encrypt and can't decrypt information - meaning even SalusConnect cannot decrypt a user's password. The only way to recover a user's password is through the application's forgot password feature.\r
        \r
        We have also deployed Role Based Access (RBA) enabled at the REST API level. Thereforere, users can access zones that are aligned with their access rights.`,
      },
    })),
    (z = new P({
      props: {
        summary: "Use highly regarded data centres that are hosted in Canada  ",
        message: `SalusConnect is hosted in Canada by Amazon Web Services (AWS). AWS is one of the world\u2019s leading and renowned cloud infrastructure providers known for their strong track record of adhereing to strict compliance requirements including, HIPAA, ISO 27001 and SOC framework. \r
\r
        The SalusConnect web application serves from an https protocol which uses SSL Certificate in the background to encrypt and decrypt all the communication between client and server.`,
      },
    })),
    (L = new P({
      props: {
        summary: "Never store any payment information on SalusConnect",
        message: `Whenever you pay through the SalusConnect platform, we neither process nor store your banking or credit card information.\r
\r
        In order to adhere to PCI compliance requirements, the payment is processed solely by a leading platform, Stripe, that is a certified PCI-DSS Level 1 payment platform.`,
      },
    })),
    (N = new P({
      props: {
        summary: "Thoughtfully collect information that we absolutely need to",
        message:
          "SalusConnect only collects information that we consider essential in delivering a smooth and reliable service through the platform. Any information that is not considered essential to deliver the core user experience either is not collected or is made optional for users to decide if they want to provide it.",
      },
    })),
    (U = new P({
      props: {
        summary:
          "Pay significant attention to protect your account information",
        message: `SalusConnect uses an industry leading SHA 512 encryption algorithm to store user passwords. In addition, we have deployed a One-way hash system to store user passwords. Using this we can only encrypt and can't decrypt information - meaning even SalusConnect cannot decrypt a user's password. The only way to recover a user's password is through the application's forgot password feature.\r
        \r
        We have also deployed Role Based Access (RBA) enabled at the REST API level. Thereforere, users can access zones that are aligned with their access rights.`,
      },
    })),
    (G = new P({
      props: {
        summary: "Use highly regarded data centres that are hosted in Canada  ",
        message: `SalusConnect is hosted in Canada by Amazon Web Services (AWS). AWS is one of the world\u2019s leading and renowned cloud infrastructure providers known for their strong track record of adhereing to strict compliance requirements including, HIPAA, ISO 27001 and SOC framework. \r
\r
        The SalusConnect web application serves from an https protocol which uses SSL Certificate in the background to encrypt and decrypt all the communication between client and server.`,
      },
    })),
    (M = new P({
      props: {
        summary: "Never store any payment information on SalusConnect",
        message: `Whenever you pay through the SalusConnect platform, we neither process nor store your banking or credit card information.\r
\r
        In order to adhere to PCI compliance requirements, the payment is processed solely by a leading platform, Stripe, that is a certified PCI-DSS Level 1 payment platform.`,
      },
    })),
    (j = new P({
      props: {
        summary:
          "There are additional layers of security checks and balances in place to ensure that you can use SalusConnect feeling confident that we have deployed industry-leading security measures and continue to improve them even further over time.",
        message:
          "If you discover a security issue, please email us at security@salusconnect.ca.",
      },
    })),
    {
      c() {
        (t = a("div")),
          (l = a("div")),
          (p = a("div")),
          (w = b("Security")),
          (u = d()),
          (f = a("div")),
          (y = b(
            "Protecting your data and information is of paramount importance to us."
          )),
          (h = a("br")),
          (F = a("br")),
          (K = b("No compromises.")),
          (ce = d()),
          (E = a("div")),
          (g = a("div")),
          (de = b(
            "We know that Canadians value their personal information. And when you use SalusConnect, you are trusting us with something important."
          )),
          (me = a("br")),
          (ue = a("br")),
          (pe = b(
            "Therefore, we\u2019ve implemented a host of security and privacy features to ensure that we are protecting your information at every step."
          )),
          (fe = a("br")),
          (he = a("br")),
          (ye = b(
            "And we continue to strengthen the platform\u2019s security with every product release."
          )),
          (ge = d()),
          (Q = a("div")),
          (q = a("img")),
          (ve = d()),
          (X = a("div")),
          (we = b("How we protect your data and information")),
          (be = d()),
          (v = a("div")),
          S(O.$$.fragment),
          ($e = d()),
          S(H.$$.fragment),
          (xe = d()),
          S(z.$$.fragment),
          (Se = d()),
          S(L.$$.fragment),
          (_e = d()),
          (V = a("div")),
          (C = a("div")),
          S(N.$$.fragment),
          (Ie = d()),
          S(U.$$.fragment),
          (De = d()),
          (W = a("div")),
          S(G.$$.fragment),
          (ke = d()),
          S(M.$$.fragment),
          (Ae = d()),
          (Y = a("div")),
          S(j.$$.fragment),
          (Pe = d()),
          (T = a("div")),
          (Z = a("div")),
          (Ee =
            b(`Our Privacy Policy outlines how we collect and use your data. It also describes our operating philosophy around our focus and commitment towards protecting your privacy. \r
    \r
            Please take a moment to review and get acquianted with our Privacy Policy. We have attemted to keep the language simple for the ease of understanding.`)),
          (Ve = d()),
          (ee = a("div")),
          (J = a("img")),
          this.h();
      },
      l(s) {
        t = r(s, "DIV", { class: !0 });
        var c = i(t);
        l = r(c, "DIV", { class: !0 });
        var re = i(l);
        p = r(re, "DIV", { class: !0 });
        var Re = i(p);
        (w = $(Re, "Security")),
          Re.forEach(o),
          (u = m(re)),
          (f = r(re, "DIV", { class: !0 }));
        var te = i(f);
        (y = $(
          te,
          "Protecting your data and information is of paramount importance to us."
        )),
          (h = r(te, "BR", {})),
          (F = r(te, "BR", {})),
          (K = $(te, "No compromises.")),
          te.forEach(o),
          re.forEach(o),
          (ce = m(c)),
          (E = r(c, "DIV", { class: !0 }));
        var se = i(E);
        g = r(se, "DIV", { class: !0 });
        var R = i(g);
        (de = $(
          R,
          "We know that Canadians value their personal information. And when you use SalusConnect, you are trusting us with something important."
        )),
          (me = r(R, "BR", {})),
          (ue = r(R, "BR", {})),
          (pe = $(
            R,
            "Therefore, we\u2019ve implemented a host of security and privacy features to ensure that we are protecting your information at every step."
          )),
          (fe = r(R, "BR", {})),
          (he = r(R, "BR", {})),
          (ye = $(
            R,
            "And we continue to strengthen the platform\u2019s security with every product release."
          )),
          R.forEach(o),
          (ge = m(se)),
          (Q = r(se, "DIV", { class: !0 }));
        var Be = i(Q);
        (q = r(Be, "IMG", { class: !0, src: !0, alt: !0 })),
          Be.forEach(o),
          se.forEach(o),
          (ve = m(c)),
          (X = r(c, "DIV", { class: !0 }));
        var qe = i(X);
        (we = $(qe, "How we protect your data and information")),
          qe.forEach(o),
          (be = m(c)),
          (v = r(c, "DIV", { class: !0 }));
        var B = i(v);
        _(O.$$.fragment, B),
          ($e = m(B)),
          _(H.$$.fragment, B),
          (xe = m(B)),
          _(z.$$.fragment, B),
          (Se = m(B)),
          _(L.$$.fragment, B),
          B.forEach(o),
          (_e = m(c)),
          (V = r(c, "DIV", { class: !0 }));
        var ne = i(V);
        C = r(ne, "DIV", { class: !0 });
        var oe = i(C);
        _(N.$$.fragment, oe),
          (Ie = m(oe)),
          _(U.$$.fragment, oe),
          oe.forEach(o),
          (De = m(ne)),
          (W = r(ne, "DIV", { class: !0 }));
        var ie = i(W);
        _(G.$$.fragment, ie),
          (ke = m(ie)),
          _(M.$$.fragment, ie),
          ie.forEach(o),
          ne.forEach(o),
          (Ae = m(c)),
          (Y = r(c, "DIV", { class: !0 }));
        var Oe = i(Y);
        _(j.$$.fragment, Oe),
          Oe.forEach(o),
          (Pe = m(c)),
          (T = r(c, "DIV", { class: !0 }));
        var le = i(T);
        Z = r(le, "DIV", { class: !0 });
        var He = i(Z);
        (Ee = $(
          He,
          `Our Privacy Policy outlines how we collect and use your data. It also describes our operating philosophy around our focus and commitment towards protecting your privacy. \r
    \r
            Please take a moment to review and get acquianted with our Privacy Policy. We have attemted to keep the language simple for the ease of understanding.`
        )),
          He.forEach(o),
          (Ve = m(le)),
          (ee = r(le, "DIV", { class: !0 }));
        var ze = i(ee);
        (J = r(ze, "IMG", { class: !0, src: !0, alt: !0 })),
          ze.forEach(o),
          le.forEach(o),
          c.forEach(o),
          this.h();
      },
      h() {
        n(
          p,
          "class",
          "w-1/2 font-bold text-4xl tablet:text-5xl text-blue-400 text-center"
        ),
          n(f, "class", "w-1/2 font-light text-xs tablet:text-base "),
          n(
            l,
            "class",
            "security-header flex px-5 space-x-5 items-center h-40 tablet:px-8 desktop:px-32 bg-gradient-to-t from-blue-100"
          ),
          n(g, "class", "w-1/2 text-sm tablet:text-lg font-normal leading-5"),
          n(q, "class", "scale-75 aspect-auto m-auto"),
          Ne(q.src, (We = "/security-lock.png")) || n(q, "src", We),
          n(q, "alt", "summary"),
          n(Q, "class", "w-1/2"),
          n(
            E,
            "class",
            "security-summary px-5 tablet:px-8 desktop:px-32 flex flex-row space-x-6 items-center"
          ),
          n(
            X,
            "class",
            "security-facts-header font-bold text-lg tablet:text-2xl tablet:text-center text-blue-400 leading-5"
          ),
          n(
            v,
            "class",
            "security-facts none flex flex-col space-y-5 mx-5 tablet:hidden desktop:hidden"
          ),
          n(C, "class", "flex flex-col w-1/2 space-y-5"),
          n(W, "class", "flex flex-col w-1/2 space-y-5"),
          n(
            V,
            "class",
            "hidden tablet:flex tablet:flex-row tablet:space-x-8 tablet:mx-8 desktop:px-32 desktop:bg-[url('/security-shield.png')] desktop:bg-no-repeat desktop:bg-center"
          ),
          n(Y, "class", "mx-5 tablet:mx-8 desktop:px-32"),
          n(
            Z,
            "class",
            "security-wrapup whitespace-pre-line text-sm font-normal py-3 tablet:w-1/2 tablet:text-lg tablet: leading-6"
          ),
          n(J, "class", "aspect-auto m-auto"),
          Ne(J.src, (Te = "/security-key.png")) || n(J, "src", Te),
          n(J, "alt", "summary"),
          n(ee, "class", "w-0 tablet:w-1/2"),
          n(
            T,
            "class",
            "flex flex-row items-center tablet:mx-8 desktop:px-32 desktop:bg-gradient-to-t from-gray-200"
          ),
          n(
            t,
            "class",
            "main-layout flex flex-col space-y-6 desktop:space-y-8"
          );
      },
      m(s, c) {
        je(s, t, c),
          e(t, l),
          e(l, p),
          e(p, w),
          e(l, u),
          e(l, f),
          e(f, y),
          e(f, h),
          e(f, F),
          e(f, K),
          e(t, ce),
          e(t, E),
          e(E, g),
          e(g, de),
          e(g, me),
          e(g, ue),
          e(g, pe),
          e(g, fe),
          e(g, he),
          e(g, ye),
          e(E, ge),
          e(E, Q),
          e(Q, q),
          e(t, ve),
          e(t, X),
          e(X, we),
          e(t, be),
          e(t, v),
          I(O, v, null),
          e(v, $e),
          I(H, v, null),
          e(v, xe),
          I(z, v, null),
          e(v, Se),
          I(L, v, null),
          e(t, _e),
          e(t, V),
          e(V, C),
          I(N, C, null),
          e(C, Ie),
          I(U, C, null),
          e(V, De),
          e(V, W),
          I(G, W, null),
          e(W, ke),
          I(M, W, null),
          e(t, Ae),
          e(t, Y),
          I(j, Y, null),
          e(t, Pe),
          e(t, T),
          e(T, Z),
          e(Z, Ee),
          e(T, Ve),
          e(T, ee),
          e(ee, J),
          (ae = !0);
      },
      p: Ce,
      i(s) {
        ae ||
          (D(O.$$.fragment, s),
          D(H.$$.fragment, s),
          D(z.$$.fragment, s),
          D(L.$$.fragment, s),
          D(N.$$.fragment, s),
          D(U.$$.fragment, s),
          D(G.$$.fragment, s),
          D(M.$$.fragment, s),
          D(j.$$.fragment, s),
          (ae = !0));
      },
      o(s) {
        k(O.$$.fragment, s),
          k(H.$$.fragment, s),
          k(z.$$.fragment, s),
          k(L.$$.fragment, s),
          k(N.$$.fragment, s),
          k(U.$$.fragment, s),
          k(G.$$.fragment, s),
          k(M.$$.fragment, s),
          k(j.$$.fragment, s),
          (ae = !1);
      },
      d(s) {
        s && o(t), A(O), A(H), A(z), A(L), A(N), A(U), A(G), A(M), A(j);
      },
    }
  );
}
class Xe extends Ue {
  constructor(t) {
    super();
    Ge(this, t, null, Ke, Me, {});
  }
}
export { Xe as default };
