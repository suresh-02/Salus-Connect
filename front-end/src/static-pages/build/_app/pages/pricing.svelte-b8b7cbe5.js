import {
  S as $e,
  i as Ee,
  s as Ie,
  e as c,
  k as g,
  c as d,
  a as u,
  m as b,
  d as r,
  b as p,
  g as ee,
  I as t,
  P as ot,
  J as me,
  t as y,
  h as _,
  j as L,
  Q as ct,
  R as dt,
  w as z,
  x as j,
  y as M,
  T as pt,
  q as W,
  o as J,
  B as R,
} from "../chunks/vendor-dc0336cb.js";
function ft(a) {
  let e, l, n, i, o, h;
  return {
    c() {
      (e = c("label")), (l = c("input")), (n = g()), (i = c("span")), this.h();
    },
    l(f) {
      e = d(f, "LABEL", { class: !0 });
      var s = u(e);
      (l = d(s, "INPUT", { type: !0, class: !0 })),
        (n = b(s)),
        (i = d(s, "SPAN", { class: !0 })),
        u(i).forEach(r),
        s.forEach(r),
        this.h();
    },
    h() {
      p(l, "type", "checkbox"),
        p(l, "class", "svelte-1609q2g"),
        p(i, "class", "slider svelte-1609q2g"),
        p(e, "class", "switch svelte-1609q2g");
    },
    m(f, s) {
      ee(f, e, s),
        t(e, l),
        (l.checked = a[0]),
        t(e, n),
        t(e, i),
        o || ((h = ot(l, "change", a[2])), (o = !0));
    },
    p(f, [s]) {
      s & 1 && (l.checked = f[0]);
    },
    i: me,
    o: me,
    d(f) {
      f && r(e), (o = !1), h();
    },
  };
}
function ut(a, e, l) {
  let { checked: n = !1 } = e,
    { color: i = "#2196F3" } = e;
  function o() {
    (n = this.checked), l(0, n);
  }
  return (
    (a.$$set = (h) => {
      "checked" in h && l(0, (n = h.checked)),
        "color" in h && l(1, (i = h.color));
    }),
    [n, i, o]
  );
}
class ht extends $e {
  constructor(e) {
    super();
    Ee(this, e, ut, ft, Ie, { checked: 0, color: 1 });
  }
}
function vt(a) {
  let e,
    l,
    n,
    i = (a[4] && a[1] ? Math.round(a[1] * 0.8 * 12) : a[1]) + "",
    o,
    h,
    f,
    s,
    E = a[4] ? "year" : "month",
    k,
    S,
    $,
    N;
  return {
    c() {
      (e = c("div")),
        (l = y(`CA$ \r
                `)),
        (n = c("span")),
        (o = y(i)),
        (h = g()),
        (f = c("span")),
        (s = y("/")),
        (k = y(E)),
        (S = g()),
        ($ = c("span")),
        (N = y("+ applicable taxes")),
        this.h();
    },
    l(A) {
      e = d(A, "DIV", { class: !0 });
      var D = u(e);
      (l = _(
        D,
        `CA$ \r
                `
      )),
        (n = d(D, "SPAN", { class: !0 }));
      var q = u(n);
      (o = _(q, i)),
        q.forEach(r),
        (h = b(D)),
        (f = d(D, "SPAN", { class: !0 }));
      var x = u(f);
      (s = _(x, "/")),
        (k = _(x, E)),
        x.forEach(r),
        (S = b(D)),
        ($ = d(D, "SPAN", { class: !0 }));
      var m = u($);
      (N = _(m, "+ applicable taxes")), m.forEach(r), D.forEach(r), this.h();
    },
    h() {
      p(n, "class", "text-4xl"),
        p(f, "class", "text-sm font-normal"),
        p($, "class", "text-xs font-normal text-black"),
        p(e, "class", "font-extrabold text-3xl text-blue-400");
    },
    m(A, D) {
      ee(A, e, D),
        t(e, l),
        t(e, n),
        t(n, o),
        t(e, h),
        t(e, f),
        t(f, s),
        t(f, k),
        t(e, S),
        t(e, $),
        t($, N);
    },
    p(A, D) {
      D & 18 &&
        i !== (i = (A[4] && A[1] ? Math.round(A[1] * 0.8 * 12) : A[1]) + "") &&
        L(o, i),
        D & 16 && E !== (E = A[4] ? "year" : "month") && L(k, E);
    },
    d(A) {
      A && r(e);
    },
  };
}
function mt(a) {
  let e, l;
  return {
    c() {
      (e = c("div")), (l = y(a[1])), this.h();
    },
    l(n) {
      e = d(n, "DIV", { class: !0 });
      var i = u(e);
      (l = _(i, a[1])), i.forEach(r), this.h();
    },
    h() {
      p(e, "class", "font-extrabold text-3xl text-blue-400");
    },
    m(n, i) {
      ee(n, e, i), t(e, l);
    },
    p(n, i) {
      i & 2 && L(l, n[1]);
    },
    d(n) {
      n && r(e);
    },
  };
}
function it(a) {
  let e, l;
  return {
    c() {
      (e = c("div")), (l = y(a[2])), this.h();
    },
    l(n) {
      e = d(n, "DIV", { class: !0 });
      var i = u(e);
      (l = _(i, a[2])), i.forEach(r), this.h();
    },
    h() {
      p(e, "class", "text-sm text-blue-400 whitespace-pre-line");
    },
    m(n, i) {
      ee(n, e, i), t(e, l);
    },
    p(n, i) {
      i & 4 && L(l, n[2]);
    },
    d(n) {
      n && r(e);
    },
  };
}
function st(a) {
  let e,
    l = a[3].secondary + "",
    n;
  return {
    c() {
      (e = c("span")), (n = y(l)), this.h();
    },
    l(i) {
      e = d(i, "SPAN", { class: !0 });
      var o = u(e);
      (n = _(o, l)), o.forEach(r), this.h();
    },
    h() {
      p(e, "class", "text-blue-400");
    },
    m(i, o) {
      ee(i, e, o), t(e, n);
    },
    p(i, o) {
      o & 8 && l !== (l = i[3].secondary + "") && L(n, l);
    },
    d(i) {
      i && r(e);
    },
  };
}
function gt(a) {
  let e,
    l,
    n,
    i,
    o,
    h,
    f,
    s,
    E,
    k,
    S = a[3].primary + "",
    $,
    N;
  function A(w, I) {
    return w[1] === "Free Always" ? mt : vt;
  }
  let D = A(a),
    q = D(a),
    x = a[2] && it(a),
    m = a[3].secondary && st(a);
  return {
    c() {
      (e = c("div")),
        (l = c("div")),
        (n = y(a[0])),
        (i = g()),
        (o = c("div")),
        (h = c("div")),
        q.c(),
        (f = g()),
        (s = c("div")),
        x && x.c(),
        (E = g()),
        (k = c("div")),
        ($ = y(S)),
        (N = g()),
        m && m.c(),
        this.h();
    },
    l(w) {
      e = d(w, "DIV", { class: !0 });
      var I = u(e);
      l = d(I, "DIV", { class: !0 });
      var V = u(l);
      (n = _(V, a[0])),
        V.forEach(r),
        (i = b(I)),
        (o = d(I, "DIV", { class: !0 }));
      var T = u(o);
      h = d(T, "DIV", { class: !0 });
      var se = u(h);
      q.l(se), se.forEach(r), (f = b(T)), (s = d(T, "DIV", {}));
      var B = u(s);
      x && x.l(B),
        B.forEach(r),
        T.forEach(r),
        (E = b(I)),
        (k = d(I, "DIV", { class: !0 }));
      var O = u(k);
      ($ = _(O, S)),
        (N = b(O)),
        m && m.l(O),
        O.forEach(r),
        I.forEach(r),
        this.h();
    },
    h() {
      p(l, "class", "font-bold text-2xl"),
        p(h, "class", "flex flex-row"),
        p(o, "class", "flex flex-col space-y-2"),
        p(k, "class", "whitespace-pre-line text-base"),
        p(
          e,
          "class",
          "flex flex-col rounded-2xl space-y-3 border-4 border-blue-400 p-3 bg-white"
        );
    },
    m(w, I) {
      ee(w, e, I),
        t(e, l),
        t(l, n),
        t(e, i),
        t(e, o),
        t(o, h),
        q.m(h, null),
        t(o, f),
        t(o, s),
        x && x.m(s, null),
        t(e, E),
        t(e, k),
        t(k, $),
        t(k, N),
        m && m.m(k, null);
    },
    p(w, [I]) {
      I & 1 && L(n, w[0]),
        D === (D = A(w)) && q
          ? q.p(w, I)
          : (q.d(1), (q = D(w)), q && (q.c(), q.m(h, null))),
        w[2]
          ? x
            ? x.p(w, I)
            : ((x = it(w)), x.c(), x.m(s, null))
          : x && (x.d(1), (x = null)),
        I & 8 && S !== (S = w[3].primary + "") && L($, S),
        w[3].secondary
          ? m
            ? m.p(w, I)
            : ((m = st(w)), m.c(), m.m(k, null))
          : m && (m.d(1), (m = null));
    },
    i: me,
    o: me,
    d(w) {
      w && r(e), q.d(), x && x.d(), m && m.d();
    },
  };
}
function bt(a, e, l) {
  let { planTitle: n } = e,
    { planPrice: i } = e,
    { planPriceDetails: o } = e,
    { planDetails: h } = e,
    { isAnnual: f } = e;
  return (
    console.log(i),
    (a.$$set = (s) => {
      "planTitle" in s && l(0, (n = s.planTitle)),
        "planPrice" in s && l(1, (i = s.planPrice)),
        "planPriceDetails" in s && l(2, (o = s.planPriceDetails)),
        "planDetails" in s && l(3, (h = s.planDetails)),
        "isAnnual" in s && l(4, (f = s.isAnnual));
    }),
    [n, i, o, h, f]
  );
}
class Pe extends $e {
  constructor(e) {
    super();
    Ee(this, e, bt, gt, Ie, {
      planTitle: 0,
      planPrice: 1,
      planPriceDetails: 2,
      planDetails: 3,
      isAnnual: 4,
    });
  }
}
function yt(a) {
  let e, l, n, i, o, h;
  return {
    c() {
      (e = c("div")),
        (l = c("div")),
        (n = y(a[0])),
        (i = g()),
        (o = c("div")),
        (h = y(a[1])),
        this.h();
    },
    l(f) {
      e = d(f, "DIV", { class: !0 });
      var s = u(e);
      l = d(s, "DIV", { class: !0 });
      var E = u(l);
      (n = _(E, a[0])),
        E.forEach(r),
        (i = b(s)),
        (o = d(s, "DIV", { class: !0 }));
      var k = u(o);
      (h = _(k, a[1])), k.forEach(r), s.forEach(r), this.h();
    },
    h() {
      p(l, "class", "text-lg font-bold"),
        p(o, "class", "text-sm font-normal"),
        p(e, "class", "flex flex-col space-y-4");
    },
    m(f, s) {
      ee(f, e, s), t(e, l), t(l, n), t(e, i), t(e, o), t(o, h);
    },
    p(f, [s]) {
      s & 1 && L(n, f[0]), s & 2 && L(h, f[1]);
    },
    i: me,
    o: me,
    d(f) {
      f && r(e);
    },
  };
}
function _t(a, e, l) {
  let { question: n } = e,
    { answer: i } = e;
  return (
    (a.$$set = (o) => {
      "question" in o && l(0, (n = o.question)),
        "answer" in o && l(1, (i = o.answer));
    }),
    [n, i]
  );
}
class ke extends $e {
  constructor(e) {
    super();
    Ee(this, e, _t, yt, Ie, { question: 0, answer: 1 });
  }
}
function Dt(a) {
  let e,
    l,
    n,
    i,
    o,
    h,
    f,
    s,
    E,
    k,
    S,
    $,
    N,
    A,
    D,
    q,
    x,
    m,
    w,
    I,
    V,
    T,
    se,
    B,
    O,
    U,
    Ae,
    G,
    qe,
    re,
    H,
    oe,
    Ve,
    Se,
    Q,
    Te,
    ce,
    Ce,
    Ne,
    Be,
    Y,
    de,
    Fe,
    ze,
    pe,
    fe,
    je,
    Me,
    K,
    ue,
    We,
    Je,
    C,
    te,
    Re,
    ae,
    Le,
    le,
    Oe,
    ne,
    Ue,
    he,
    Ge,
    ye;
  function rt(v) {
    a[2](v);
  }
  let He = {};
  return (
    a[0] !== void 0 && (He.checked = a[0]),
    ($ = new ht({ props: He })),
    ct.push(() => dt($, "checked", rt)),
    (T = new Pe({
      props: {
        isAnnual: a[0],
        planTitle: a[1].free.planTitle,
        planPrice: a[1].free.planPrice,
        planPriceDetails: a[1].free.planPriceDetails,
        planDetails: a[1].free.planDetails,
      },
    })),
    (B = new Pe({
      props: {
        isAnnual: a[0],
        planTitle: a[1].individual.planTitle,
        planPrice: a[1].individual.planPrice,
        planPriceDetails: a[1].individual.planPriceDetails,
        planDetails: a[1].individual.planDetails,
      },
    })),
    (U = new Pe({
      props: {
        isAnnual: a[0],
        planTitle: a[1].clinic.planTitle,
        planPrice: a[1].clinic.planPrice,
        planPriceDetails: a[1].clinic.planPriceDetails,
        planDetails: a[1].clinic.planDetails,
      },
    })),
    (G = new Pe({
      props: {
        isAnnual: a[0],
        planTitle: a[1].clinicplus.planTitle,
        planPrice: a[1].clinicplus.planPrice,
        planPriceDetails: a[1].clinicplus.planPriceDetails,
        planDetails: a[1].clinicplus.planDetails,
      },
    })),
    (te = new ke({
      props: {
        question: "Do you offer a free trial?",
        answer:
          "We don\u2019t. We have spent countless days, weeks and months creating a product which we believe will radically improve patient discovery, access and management. And we are confident that once you use it, you will find it incredibly useful. But don\u2019t take our word for it.",
      },
    })),
    (ae = new ke({
      props: {
        question: "How quickly can I get approved?",
        answer:
          "In as little as 1-2 business days. Please note that approval may take longer in some cases. ",
      },
    })),
    (le = new ke({
      props: {
        question: "Where do I pay for my subscription?",
        answer:
          "Once you log in to an authorized account, navigate to the business tab to pay for your subscription. You will need to pay within 3 calendar days of the start of your subscription to continue using SalusConnect\u2019s services. Payment defaults will incur a monthly penalty of 20% the value of your monthly subscription.",
      },
    })),
    (ne = new ke({
      props: {
        question: "I have more questions.",
        answer: "Please send us an email at onboard@salusconnect.ca",
      },
    })),
    {
      c() {
        (e = c("div")),
          (l = c("div")),
          (n = y(`No artificial barriers to entry.\r
        `)),
          (i = c("span")),
          (o = y("Start using for free.")),
          (h = g()),
          (f = c("div")),
          (s = c("div")),
          (E = c("div")),
          (k = y(`Billed\r
                Monthly`)),
          (S = g()),
          z($.$$.fragment),
          (A = g()),
          (D = c("div")),
          (q = y(`Billed\r
                Annually`)),
          (x = g()),
          (m = c("div")),
          (w = y("Save 15% with an annual plan")),
          (I = g()),
          (V = c("div")),
          z(T.$$.fragment),
          (se = g()),
          z(B.$$.fragment),
          (O = g()),
          z(U.$$.fragment),
          (Ae = g()),
          z(G.$$.fragment),
          (qe = g()),
          (re = c("div")),
          (H = c("div")),
          (oe = c("div")),
          (Ve = y("Custom Plans")),
          (Se = g()),
          (Q = c("div")),
          (Te = y(
            "For systems with 20 practitioners or more, plans start at CA$ 249. Please contact us at "
          )),
          (ce = c("span")),
          (Ce = y("onboard@salusconnect.ca")),
          (Ne = y(" for a custom plan that is tailoered for your needs.")),
          (Be = g()),
          (Y = c("div")),
          (de = c("div")),
          (Fe = y(
            "To protect our patient community, we require you to undergo a simple verification process before you can get listed on SalusConnect and start using the platform."
          )),
          (ze = g()),
          (pe = c("div")),
          (fe = c("button")),
          (je = y("Request to Join")),
          (Me = g()),
          (K = c("div")),
          (ue = c("div")),
          (We = y("frequently asked questions")),
          (Je = g()),
          (C = c("div")),
          z(te.$$.fragment),
          (Re = g()),
          z(ae.$$.fragment),
          (Le = g()),
          z(le.$$.fragment),
          (Oe = g()),
          z(ne.$$.fragment),
          (Ue = g()),
          (he = c("div")),
          (Ge = y(
            "Simplified pricing based on size of your practice so that you can focus on providing the best possible patient experience."
          )),
          this.h();
      },
      l(v) {
        e = d(v, "DIV", { class: !0 });
        var P = u(e);
        l = d(P, "DIV", { class: !0 });
        var ve = u(l);
        (n = _(
          ve,
          `No artificial barriers to entry.\r
        `
        )),
          (i = d(ve, "SPAN", { class: !0 }));
        var ge = u(i);
        (o = _(ge, "Start using for free.")),
          ge.forEach(r),
          ve.forEach(r),
          (h = b(P)),
          (f = d(P, "DIV", { class: !0 }));
        var ie = u(f);
        s = d(ie, "DIV", { class: !0 });
        var F = u(s);
        E = d(F, "DIV", { class: !0 });
        var be = u(E);
        (k = _(
          be,
          `Billed\r
                Monthly`
        )),
          be.forEach(r),
          (S = b(F)),
          j($.$$.fragment, F),
          (A = b(F)),
          (D = d(F, "DIV", { class: !0 }));
        var Qe = u(D);
        (q = _(
          Qe,
          `Billed\r
                Annually`
        )),
          Qe.forEach(r),
          F.forEach(r),
          (x = b(ie)),
          (m = d(ie, "DIV", { class: !0 }));
        var Ye = u(m);
        (w = _(Ye, "Save 15% with an annual plan")),
          Ye.forEach(r),
          ie.forEach(r),
          (I = b(P)),
          (V = d(P, "DIV", { class: !0 }));
        var X = u(V);
        j(T.$$.fragment, X),
          (se = b(X)),
          j(B.$$.fragment, X),
          (O = b(X)),
          j(U.$$.fragment, X),
          (Ae = b(X)),
          j(G.$$.fragment, X),
          X.forEach(r),
          (qe = b(P)),
          (re = d(P, "DIV", { class: !0 }));
        var Ke = u(re);
        H = d(Ke, "DIV", { class: !0 });
        var _e = u(H);
        oe = d(_e, "DIV", { class: !0 });
        var Xe = u(oe);
        (Ve = _(Xe, "Custom Plans")),
          Xe.forEach(r),
          (Se = b(_e)),
          (Q = d(_e, "DIV", { class: !0 }));
        var De = u(Q);
        (Te = _(
          De,
          "For systems with 20 practitioners or more, plans start at CA$ 249. Please contact us at "
        )),
          (ce = d(De, "SPAN", { class: !0 }));
        var Ze = u(ce);
        (Ce = _(Ze, "onboard@salusconnect.ca")),
          Ze.forEach(r),
          (Ne = _(De, " for a custom plan that is tailoered for your needs.")),
          De.forEach(r),
          _e.forEach(r),
          Ke.forEach(r),
          (Be = b(P)),
          (Y = d(P, "DIV", { class: !0 }));
        var xe = u(Y);
        de = d(xe, "DIV", { class: !0 });
        var et = u(de);
        (Fe = _(
          et,
          "To protect our patient community, we require you to undergo a simple verification process before you can get listed on SalusConnect and start using the platform."
        )),
          et.forEach(r),
          (ze = b(xe)),
          (pe = d(xe, "DIV", { class: !0 }));
        var tt = u(pe);
        fe = d(tt, "BUTTON", { class: !0 });
        var at = u(fe);
        (je = _(at, "Request to Join")),
          at.forEach(r),
          tt.forEach(r),
          xe.forEach(r),
          (Me = b(P)),
          (K = d(P, "DIV", { class: !0 }));
        var we = u(K);
        ue = d(we, "DIV", { class: !0 });
        var lt = u(ue);
        (We = _(lt, "frequently asked questions")),
          lt.forEach(r),
          (Je = b(we)),
          (C = d(we, "DIV", { class: !0 }));
        var Z = u(C);
        j(te.$$.fragment, Z),
          (Re = b(Z)),
          j(ae.$$.fragment, Z),
          (Le = b(Z)),
          j(le.$$.fragment, Z),
          (Oe = b(Z)),
          j(ne.$$.fragment, Z),
          Z.forEach(r),
          we.forEach(r),
          (Ue = b(P)),
          (he = d(P, "DIV", { class: !0 }));
        var nt = u(he);
        (Ge = _(
          nt,
          "Simplified pricing based on size of your practice so that you can focus on providing the best possible patient experience."
        )),
          nt.forEach(r),
          P.forEach(r),
          this.h();
      },
      h() {
        p(i, "class", "text-blue-400"),
          p(
            l,
            "class",
            "pricing-intro space-x-5 items-center px-5 tablet:px-8 desktop:px-20 font-bold text-2xl tablet:text-5xl desktop:text-6xl tablet:text-center"
          ),
          p(E, "class", "whitespace-pre-line"),
          p(D, "class", "text-blue-400 font-bold whitespace-pre-line"),
          p(
            s,
            "class",
            "flex flex-row justify-center text-lg text-center space-x-3"
          ),
          p(m, "class", "font-bold tablet:text-lg"),
          p(
            f,
            "class",
            "pricing-summary flex flex-col items-center space-y-3 px-5 tablet:px-8 desktop:px-20"
          ),
          p(
            V,
            "class",
            "pricing-plans flex flex-col tablet:flex-row space-y-4 tablet:space-y-0 tablet:space-x-5 px-5 tablet:px-8 desktop:px-20 desktop:bg-[url('/pricing.png')] desktop:bg-no-repeat desktop:bg-center desktop:bg-cover desktop:py-4"
          ),
          p(oe, "class", "text-2xl font-bold tablet:w-1/3"),
          p(ce, "class", "font-bold"),
          p(Q, "class", "text-lg font-light tablet:w-2/3"),
          p(
            H,
            "class",
            "rounded-2xl border-4 bg-black p-3 text-white flex flex-col tablet:flex-row space-y-5 tablet:space-y-0 items-center "
          ),
          p(re, "class", "custom-plan px-5 tablet:px-8 desktop:px-20"),
          p(de, "class", "font-bold text-center text-lg tablet:text-xl"),
          p(
            fe,
            "class",
            "bg-black text-white px-6 py-3 rounded-lg tablet:text-lg"
          ),
          p(pe, "class", "flex justify-center "),
          p(
            Y,
            "class",
            "pricing-requesttojoin flex flex-col space-y-5 px-5 tablet:px-8 desktop:px-20 desktop:bg-gradient-to-t desktop:from-blue-100"
          ),
          p(ue, "class", "font-bold"),
          p(C, "class", "pricing-faq flex flex-col space-y-5"),
          p(
            K,
            "class",
            "pricing-faqs flex flex-col tablet:flex-row tablet:items-center text-4xl space-y-4 tablet:space-y-0 tablet:space-x-8 px-5 tablet:px-8 desktop:px-20"
          ),
          p(
            he,
            "class",
            "pricing-footnote font-bold text-center text-lg tablet:text-xl px-5 tablet:px-8 desktop:px-20"
          ),
          p(
            e,
            "class",
            "main-layout flex flex-col space-y-8 tablet:space-y-10 desktop:space-y-16"
          );
      },
      m(v, P) {
        ee(v, e, P),
          t(e, l),
          t(l, n),
          t(l, i),
          t(i, o),
          t(e, h),
          t(e, f),
          t(f, s),
          t(s, E),
          t(E, k),
          t(s, S),
          M($, s, null),
          t(s, A),
          t(s, D),
          t(D, q),
          t(f, x),
          t(f, m),
          t(m, w),
          t(e, I),
          t(e, V),
          M(T, V, null),
          t(V, se),
          M(B, V, null),
          t(V, O),
          M(U, V, null),
          t(V, Ae),
          M(G, V, null),
          t(e, qe),
          t(e, re),
          t(re, H),
          t(H, oe),
          t(oe, Ve),
          t(H, Se),
          t(H, Q),
          t(Q, Te),
          t(Q, ce),
          t(ce, Ce),
          t(Q, Ne),
          t(e, Be),
          t(e, Y),
          t(Y, de),
          t(de, Fe),
          t(Y, ze),
          t(Y, pe),
          t(pe, fe),
          t(fe, je),
          t(e, Me),
          t(e, K),
          t(K, ue),
          t(ue, We),
          t(K, Je),
          t(K, C),
          M(te, C, null),
          t(C, Re),
          M(ae, C, null),
          t(C, Le),
          M(le, C, null),
          t(C, Oe),
          M(ne, C, null),
          t(e, Ue),
          t(e, he),
          t(he, Ge),
          (ye = !0);
      },
      p(v, [P]) {
        const ve = {};
        !N && P & 1 && ((N = !0), (ve.checked = v[0]), pt(() => (N = !1))),
          $.$set(ve);
        const ge = {};
        P & 1 && (ge.isAnnual = v[0]), T.$set(ge);
        const ie = {};
        P & 1 && (ie.isAnnual = v[0]), B.$set(ie);
        const F = {};
        P & 1 && (F.isAnnual = v[0]), U.$set(F);
        const be = {};
        P & 1 && (be.isAnnual = v[0]), G.$set(be);
      },
      i(v) {
        ye ||
          (W($.$$.fragment, v),
          W(T.$$.fragment, v),
          W(B.$$.fragment, v),
          W(U.$$.fragment, v),
          W(G.$$.fragment, v),
          W(te.$$.fragment, v),
          W(ae.$$.fragment, v),
          W(le.$$.fragment, v),
          W(ne.$$.fragment, v),
          (ye = !0));
      },
      o(v) {
        J($.$$.fragment, v),
          J(T.$$.fragment, v),
          J(B.$$.fragment, v),
          J(U.$$.fragment, v),
          J(G.$$.fragment, v),
          J(te.$$.fragment, v),
          J(ae.$$.fragment, v),
          J(le.$$.fragment, v),
          J(ne.$$.fragment, v),
          (ye = !1);
      },
      d(v) {
        v && r(e), R($), R(T), R(B), R(U), R(G), R(te), R(ae), R(le), R(ne);
      },
    }
  );
}
function xt(a, e, l) {
  let n = !1,
    i = {
      free: {
        planTitle: "Basic",
        planPrice: "Free Always",
        planPriceDetails: "",
        planDetails: {
          primary: `Get your practice listing up on SalusConnect and immediately improve your visibility. 

When you are ready to start getting appointments through SalusConnect, upgrade to a higher tier.`,
          secondary: null,
        },
      },
      individual: {
        planTitle: "Individual",
        planPrice: 19,
        planPriceDetails: null,
        planDetails: {
          primary: `For solo practitioners with big aspirations.

Everything in Basic.`,
          secondary:
            "Plus, full access to the entire SalusConnect platform for one practitioner.",
        },
      },
      clinic: {
        planTitle: "Clinic",
        planPrice: "59",
        planPriceDetails: `+ Add CA$ 10 for every additional practitioner
++ Add CA$ 6 for every additional staff.`,
        planDetails: {
          primary: `For practices that are ready to modernize and enhance patient experience.

Everything in Individual.`,
          secondary: "Plus full access for up to 3 practitioners and 1 staff.",
        },
      },
      clinicplus: {
        planTitle: "Clinic Plus",
        planPrice: 119,
        planPriceDetails: `+ Add CA$ 10 for every additional practitioner
++ Add CA$ 6 for every additional staff.`,
        planDetails: {
          primary: `For larger practices that are optimizing operations and are scaling rapidly.

Everything in Individual.`,
          secondary: "Plus full access for up to 7 practitioners and 2 staff.",
        },
      },
    };
  function o(h) {
    (n = h), l(0, n);
  }
  return [n, i, o];
}
class Pt extends $e {
  constructor(e) {
    super();
    Ee(this, e, xt, Dt, Ie, {});
  }
}
export { Pt as default };
