import {
  S as fe,
  i as ue,
  s as he,
  e as g,
  c as y,
  a as w,
  d as u,
  b as d,
  H as B,
  g as G,
  I as l,
  t as V,
  h as S,
  j as z,
  k,
  m as E,
  J as te,
  w as R,
  x as U,
  y as X,
  q as Y,
  o as Z,
  B as $,
} from "../chunks/vendor-dc0336cb.js";
function ne(r) {
  let e, t, a;
  return {
    c() {
      (e = g("div")), (t = g("img")), this.h();
    },
    l(i) {
      e = y(i, "DIV", { class: !0 });
      var o = w(e);
      (t = y(o, "IMG", { class: !0, src: !0, alt: !0 })),
        o.forEach(u),
        this.h();
    },
    h() {
      d(t, "class", "object-center rounded-lg scale-75 flex-grow-0"),
        B(t.src, (a = "/" + r[4])) || d(t, "src", a),
        d(t, "alt", "details"),
        d(e, "class", "hidden tablet:flex tablet:w-1/2 tablet:justify-center");
    },
    m(i, o) {
      G(i, e, o), l(e, t);
    },
    p(i, o) {
      o & 16 && !B(t.src, (a = "/" + i[4])) && d(t, "src", a);
    },
    d(i) {
      i && u(e);
    },
  };
}
function oe(r) {
  let e, t;
  return {
    c() {
      (e = g("div")), (t = V(r[2])), this.h();
    },
    l(a) {
      e = y(a, "DIV", { class: !0 });
      var i = w(e);
      (t = S(i, r[2])), i.forEach(u), this.h();
    },
    h() {
      d(e, "class", "py-2 font-bold tablet:text-lg");
    },
    m(a, i) {
      G(a, e, i), l(e, t);
    },
    p(a, i) {
      i & 4 && z(t, a[2]);
    },
    d(a) {
      a && u(e);
    },
  };
}
function de(r) {
  let e, t;
  return {
    c() {
      (e = g("div")), (t = V(r[3])), this.h();
    },
    l(a) {
      e = y(a, "DIV", { class: !0 });
      var i = w(e);
      (t = S(i, r[3])), i.forEach(u), this.h();
    },
    h() {
      d(e, "class", "leading-5 tablet:text-lg");
    },
    m(a, i) {
      G(a, e, i), l(e, t);
    },
    p(a, i) {
      i & 8 && z(t, a[3]);
    },
    d(a) {
      a && u(e);
    },
  };
}
function ce(r) {
  let e, t, a;
  return {
    c() {
      (e = g("div")), (t = g("img")), this.h();
    },
    l(i) {
      e = y(i, "DIV", { class: !0 });
      var o = w(e);
      (t = y(o, "IMG", { class: !0, src: !0, alt: !0 })),
        o.forEach(u),
        this.h();
    },
    h() {
      d(t, "class", "object-center rounded-lg scale-75 flex-grow-0"),
        B(t.src, (a = "/" + r[4])) || d(t, "src", a),
        d(t, "alt", "details"),
        d(e, "class", "hidden tablet:flex tablet:w-1/2 tablet:justify-center");
    },
    m(i, o) {
      G(i, e, o), l(e, t);
    },
    p(i, o) {
      o & 16 && !B(t.src, (a = "/" + i[4])) && d(t, "src", a);
    },
    d(i) {
      i && u(e);
    },
  };
}
function me(r) {
  let e,
    t,
    a,
    i,
    o,
    b,
    p,
    D,
    n,
    x,
    j,
    c = r[5] && ne(r),
    m = r[2] && oe(r),
    f = r[3] && de(r),
    v = !r[5] && ce(r);
  return {
    c() {
      (e = g("div")),
        c && c.c(),
        (t = k()),
        (a = g("div")),
        (i = g("div")),
        (o = V(r[0])),
        (b = k()),
        (p = g("div")),
        (D = V(r[1])),
        (n = k()),
        m && m.c(),
        (x = k()),
        f && f.c(),
        (j = k()),
        v && v.c(),
        this.h();
    },
    l(s) {
      e = y(s, "DIV", { class: !0 });
      var h = w(e);
      c && c.l(h), (t = E(h)), (a = y(h, "DIV", { class: !0 }));
      var I = w(a);
      i = y(I, "DIV", { class: !0 });
      var M = w(i);
      (o = S(M, r[0])),
        M.forEach(u),
        (b = E(I)),
        (p = y(I, "DIV", { class: !0 }));
      var A = w(p);
      (D = S(A, r[1])),
        A.forEach(u),
        (n = E(I)),
        m && m.l(I),
        (x = E(I)),
        f && f.l(I),
        I.forEach(u),
        (j = E(h)),
        v && v.l(h),
        h.forEach(u),
        this.h();
    },
    h() {
      d(i, "class", "text-2xl font-bold desktop:text-5xl"),
        d(p, "class", "leading-5 tablet:text-lg "),
        d(a, "class", "flex flex-col text-sm space-y-5 tablet:w-1/2"),
        d(
          e,
          "class",
          "flex flex-col tablet:flex-row tablet:space-x-4 tablet:items-center tablet:justify-between"
        );
    },
    m(s, h) {
      G(s, e, h),
        c && c.m(e, null),
        l(e, t),
        l(e, a),
        l(a, i),
        l(i, o),
        l(a, b),
        l(a, p),
        l(p, D),
        l(a, n),
        m && m.m(a, null),
        l(a, x),
        f && f.m(a, null),
        l(e, j),
        v && v.m(e, null);
    },
    p(s, [h]) {
      s[5]
        ? c
          ? c.p(s, h)
          : ((c = ne(s)), c.c(), c.m(e, t))
        : c && (c.d(1), (c = null)),
        h & 1 && z(o, s[0]),
        h & 2 && z(D, s[1]),
        s[2]
          ? m
            ? m.p(s, h)
            : ((m = oe(s)), m.c(), m.m(a, x))
          : m && (m.d(1), (m = null)),
        s[3]
          ? f
            ? f.p(s, h)
            : ((f = de(s)), f.c(), f.m(a, null))
          : f && (f.d(1), (f = null)),
        s[5]
          ? v && (v.d(1), (v = null))
          : v
          ? v.p(s, h)
          : ((v = ce(s)), v.c(), v.m(e, null));
    },
    i: te,
    o: te,
    d(s) {
      s && u(e), c && c.d(), m && m.d(), f && f.d(), v && v.d();
    },
  };
}
function ve(r, e, t) {
  let { title: a } = e,
    { textStart: i } = e,
    { textMiddle: o } = e,
    { textEnd: b } = e,
    { image: p } = e,
    { imageIsPrimary: D } = e;
  return (
    (r.$$set = (n) => {
      "title" in n && t(0, (a = n.title)),
        "textStart" in n && t(1, (i = n.textStart)),
        "textMiddle" in n && t(2, (o = n.textMiddle)),
        "textEnd" in n && t(3, (b = n.textEnd)),
        "image" in n && t(4, (p = n.image)),
        "imageIsPrimary" in n && t(5, (D = n.imageIsPrimary));
    }),
    [a, i, o, b, p, D]
  );
}
class ee extends fe {
  constructor(e) {
    super();
    ue(this, e, ve, me, he, {
      title: 0,
      textStart: 1,
      textMiddle: 2,
      textEnd: 3,
      image: 4,
      imageIsPrimary: 5,
    });
  }
}
function ge(r) {
  let e,
    t,
    a,
    i,
    o,
    b,
    p,
    D,
    n,
    x,
    j,
    c,
    m,
    f,
    v,
    s,
    h,
    I,
    M,
    A,
    F,
    P,
    K,
    L,
    O,
    T,
    Q,
    J;
  return (
    (x = new ee({
      props: {
        image: "careers-possibilities.jpg",
        imageIsPrimary: !1,
        title: "We believe there are no shortcuts",
        textStart:
          "When we started work on SalusConnect, it quickly became apparent that we could do it either the easy way or the right way. The easy way would have allowed us to launch in sooner but would have required us to perform less research, spend less than needed time on product architecture and design and leave important features out which would be truly valuable to Canadians and the medical community. Any guesses which path we chose?",
        textMiddle: "",
        textEnd: "",
      },
    })),
    (c = new ee({
      props: {
        image: "careers-canada.jpg",
        imageIsPrimary: !0,
        title: "And values are non-negotiable",
        textStart:
          "No matter what we do and where we go, we are driven by a set of core values that drive our actions and decisions.",
        textMiddle: "Integrity. Commitment. Passion. Hardwork.",
        textEnd: `These are the values that we live by every day. This is what defines us.\r
\r
        Today we are a startup. Tomorrow we will be a large company [:)]. We will do everything to ensure that these values don\u2019t get diluted over time.`,
      },
    })),
    (f = new ee({
      props: {
        image: "careers-toronto.jpg",
        imageIsPrimary: !1,
        title: "Consider a career with us",
        textStart: `Scaling a startup takes grit, determination and a unique kind of never-say-die attitude.\r
\r
        If you are looking to get involved in helping build a transformational platform that can potentially impact the lives of millions of Canadians every day, we\u2019d love to chat.`,
        textMiddle: "",
        textEnd: "",
      },
    })),
    {
      c() {
        (e = g("div")),
          (t = g("div")),
          (a = g("div")),
          (i = V("Careers")),
          (o = k()),
          (b = g("div")),
          (p = V(`We take this word very seriously. \r
\r
            And that\u2019s why this section is called Careers and not Jobs.`)),
          (D = k()),
          (n = g("div")),
          R(x.$$.fragment),
          (j = k()),
          R(c.$$.fragment),
          (m = k()),
          R(f.$$.fragment),
          (v = k()),
          (s = g("div")),
          (h = g("div")),
          (I = V(
            "We have openings in product, technology, marketing and sales. All positions are remote but we\u2019d love it if you are in the Greater Toronto Area. That way we can hang out once in a while."
          )),
          (M = k()),
          (A = g("div")),
          (F = V("Send us an email with your resume at ")),
          (P = g("span")),
          (K = V("business@salusconnect.ca")),
          (L = V(" We look forward to speaking with you.")),
          (O = k()),
          (T = g("div")),
          (Q = V(
            "SalusConnect an equal opportunity employer. All applicants will be considered for employment without attention to race, color, religion, sex, sexual orientation, gender identity, national origin, veteran or disability status."
          )),
          this.h();
      },
      l(_) {
        e = y(_, "DIV", { class: !0 });
        var C = w(e);
        t = y(C, "DIV", { class: !0 });
        var H = w(t);
        a = y(H, "DIV", { class: !0 });
        var ae = w(a);
        (i = S(ae, "Careers")),
          ae.forEach(u),
          (o = E(H)),
          (b = y(H, "DIV", { class: !0 }));
        var ie = w(b);
        (p = S(
          ie,
          `We take this word very seriously. \r
\r
            And that\u2019s why this section is called Careers and not Jobs.`
        )),
          ie.forEach(u),
          H.forEach(u),
          (D = E(C)),
          (n = y(C, "DIV", { class: !0 }));
        var W = w(n);
        U(x.$$.fragment, W),
          (j = E(W)),
          U(c.$$.fragment, W),
          (m = E(W)),
          U(f.$$.fragment, W),
          W.forEach(u),
          (v = E(C)),
          (s = y(C, "DIV", { class: !0 }));
        var q = w(s);
        h = y(q, "DIV", { class: !0 });
        var le = w(h);
        (I = S(
          le,
          "We have openings in product, technology, marketing and sales. All positions are remote but we\u2019d love it if you are in the Greater Toronto Area. That way we can hang out once in a while."
        )),
          le.forEach(u),
          (M = E(q)),
          (A = y(q, "DIV", {}));
        var N = w(A);
        (F = S(N, "Send us an email with your resume at ")),
          (P = y(N, "SPAN", { class: !0 }));
        var se = w(P);
        (K = S(se, "business@salusconnect.ca")),
          se.forEach(u),
          (L = S(N, " We look forward to speaking with you.")),
          N.forEach(u),
          (O = E(q)),
          (T = y(q, "DIV", { class: !0 }));
        var re = w(T);
        (Q = S(
          re,
          "SalusConnect an equal opportunity employer. All applicants will be considered for employment without attention to race, color, religion, sex, sexual orientation, gender identity, national origin, veteran or disability status."
        )),
          re.forEach(u),
          q.forEach(u),
          C.forEach(u),
          this.h();
      },
      h() {
        d(
          a,
          "class",
          "w-1/2 font-bold text-4xl tablet:text-5xl text-blue-400 text-center"
        ),
          d(
            b,
            "class",
            "w-1/2 font-light text-xs tablet:text-base whitespace-pre-line"
          ),
          d(
            t,
            "class",
            "careers-header flex px-5 space-x-5 items-center h-40 tablet:px-8 desktop:px-32 bg-gradient-to-t from-blue-100"
          ),
          d(
            n,
            "class",
            "careers-items flex flex-col space-y-8 mx-5 tablet:mx-8"
          ),
          d(h, "class", "text-lg font-bold"),
          d(P, "class", "font-bold"),
          d(T, "class", "tablet:text-lg italic"),
          d(s, "class", "flex flex-col mx-5 space-y-3 text-sm"),
          d(
            e,
            "class",
            "main-layout flex flex-col space-y-6 desktop:space-y-8"
          );
      },
      m(_, C) {
        G(_, e, C),
          l(e, t),
          l(t, a),
          l(a, i),
          l(t, o),
          l(t, b),
          l(b, p),
          l(e, D),
          l(e, n),
          X(x, n, null),
          l(n, j),
          X(c, n, null),
          l(n, m),
          X(f, n, null),
          l(e, v),
          l(e, s),
          l(s, h),
          l(h, I),
          l(s, M),
          l(s, A),
          l(A, F),
          l(A, P),
          l(P, K),
          l(A, L),
          l(s, O),
          l(s, T),
          l(T, Q),
          (J = !0);
      },
      p: te,
      i(_) {
        J ||
          (Y(x.$$.fragment, _),
          Y(c.$$.fragment, _),
          Y(f.$$.fragment, _),
          (J = !0));
      },
      o(_) {
        Z(x.$$.fragment, _), Z(c.$$.fragment, _), Z(f.$$.fragment, _), (J = !1);
      },
      d(_) {
        _ && u(e), $(x), $(c), $(f);
      },
    }
  );
}
class we extends fe {
  constructor(e) {
    super();
    ue(this, e, null, ge, he, {});
  }
}
export { we as default };
