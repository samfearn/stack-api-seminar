---
author:
- |
  Sam Fearn\
  Original notes produced by Paul Sutcliffe
title: |
  Calculus I\
  Michaelmas Term
---

# First order differential equations

## First order separable ODEs

A **differential equation** is an equation that relates an unknown
function (the dependent variable) to one or more of its derivatives. The
**order** of a differential equation is the order of the highest
derivative that appears in the equation. A function that satisfies the
differential equation is called a **solution** and the process of
finding a solution is called **solving** the differential equation. If
the dependent variable depends on only a single unknown variable (the
independent variable) then the differential equation is called an
**ordinary differential equation** (ODE). We shall deal only with ODEs.

Differential equations for functions with several independent variables
and involving partial derivatives are called **partial differential
equations** (PDEs). These are generally much harder to solve and wont be
discussed in this course.\
We shall usually discuss ODEs using \(y\) to denote the dependent
variable and \(x\) for the independent variable, so solving the ODE
involves finding \(y(x).\)\
The generic first order ODE may be written in the form

\[\label{eq:GFOO}
    \frac{dy}{dx}=f(x,y). \tag{$\star$}\]

Generically this will have a one-parameter family of solutions ie. the
**general solution** will contain an arbitrary constant. Assigning a
particular value to this constant gives a **particular solution**. A
particular solution will be singled out by the assignment of an
**initial value** ie. requiring \(y(x_0)=y_0,\) for given \(x_0\) and
\(y_0.\) In this case the ODE is called an **initial value problem**
(IVP). To solve an IVP, first solve the ODE to find the general solution
and then determine the value of the constant so that the IVP is also
satisfied.\
Depending upon the form of the function \(f(x,y)\) there are various
methods that can be used to solve certain kinds of ODEs. We shall
discuss these in turn.\
The ODE \(\eqref{eq:GFOO}\) is **separable** if \(f(x,y)=X(x)Y(y).\)

It can be solved by direct integration as
\[\int \frac{1}{Y(y)}\,dy=\int X(x)\,dx.\]

::: example
**Example 1**. Solve the IVP \[\frac{dy}{dx}=xe^{y-x} \quad
    \text{with} \quad y(0)=0.\] \[\begin{gathered}
            y'=xe^{-x}e^y, \quad \int e^{-y}\,dy=\int xe^{-x}\,dx, \quad e^{-y}=-xe^{-x}+\int e^{-x}\,dx=-xe^{-x}-e^{-x}+c \\
            y=-\log(e^{-x}(1+x)-c). \quad y(0)=0=\log(1-c), \quad \text{so}\quad c=0. \\
            y=-\log(e^{-x}(1+x))=x-\log(1+x).
        \end{gathered}\]
:::

::: example
**Example 2**. Solve \[y'=\frac{2x(1+y^2)}{(1+x^2)^2}.\]
\[\int \frac{1}{1+y^2}\,dy=\int \frac{2x}{(1+x^2)^2}\,dx, \quad \tan^{-1}y=-\frac{1}{1+x^2}-c, \quad y=-\tan\bigg(\frac{1}{1+x^2}+c\bigg).\]
:::

::: example
**Example 3**. Solve the IVP \[y'=\frac{x^2y-y}{1+y}, \quad y(3)=1.\]
\[\begin{gathered}
            \int \frac{1+y}{y}\,dy=\int (x^2-1)\, dx, \quad y+\log|y|=\frac{x^3}{3}-x+c.\quad \text{Put}\ x=3\ \text{and} \ y=1 \\
            1=6+c, \quad c=-5, \quad \text{hence} \quad y+\log|y|=\frac{x^3}{3}-x-5.
        \end{gathered}\]

In this case the final solution can only be written in implicit form ie.
it cannot be written in an explicit form \(y=...\) where the right hand
side is a function of \(x\) only.
:::

::: {.container-fluid .que .stack data-qid="1st order ODE -- Separable Explicit"}
:::

## First order homogeneous ODEs

The ODE \(\eqref{eq:GFOO}\) is **homogeneous** if
\(f(tx,ty)=f(x,y)\ \ \forall \ t\in\mathbb{R}.\)\
In this case the substitution \(y=xv\) produces a separable ODE for
\(v(x).\)\

::: example
**Example 4**. Solve \[y'=\frac{y^2-x^2}{xy}.\] We have
\[f(tx,ty)=\frac{t^2y^2-t^2x^2}{txty}=\frac{y^2-x^2}{xy}=f(x,y) \quad \text{and hence the ODE is homogeneous.}\]
Put \(y=xv\) then \(y'=v+xv'\), and the ODE becomes \[\begin{gathered}
            v+xv'=\frac{x^2v^2-x^2}{x^2v}=v-\frac{1}{v}, \quad v'=-\frac{1}{xv}, \quad \int v\,dv=\int -\frac{1}{x}\,dx, \quad \frac{v^2}{2}=-\log|x|+\log c, \\
            v=\pm \sqrt{2\log\bigg|\frac{c}{x}\bigg|}, \quad y=xv=\pm x\sqrt{2\log\bigg|\frac{c}{x}\bigg|}.
        \end{gathered}\]
:::

## First order linear ODEs

The ODE \(\eqref{eq:GFOO}\) is **linear** if \(f(x,y)=-p(x)y+q(x),\) in
which case we can write the standard form of a linear first order ODE as
\[y'+py=q\] where \(p\) and \(q\) can be any functions of \(x\).

In this case the ODE can be solved in terms of the **integrating
factor** \[I(x)=e^{\int p(x)\,dx}.\] The solution is given by
\[y=\frac{1}{I(x)}\int I(x)q(x)\, dx.\] Proof: We need to show that
\(y\) satisfies the ODE \(y'+py=q.\)\
The first step is to observe that \(I'=e^{\int p\,dx}p=Ip.\)\
With \(y=\frac{1}{I}\int Iq\,dx\) we have
\[y'=-\frac{I'}{I^2}\int Iq\,dx+\frac{1}{I}Iq =-\frac{I'}{I}y+q=-\frac{Ip}{I}y+q=-py+q,\]
as required.\

::: example
**Example 5**. Solve the IVP \[y'-\frac{2}{x}y=3x^3, \ \ y(-1)=2.\]

In the above notation \(p=-\frac{2}{x}\) and \(q=3x^3.\)
\[\begin{gathered}
            I=\exp\bigg(\int p\,dx\bigg)=\exp\bigg(\int -\frac{2}{x}\,dx\bigg) =\exp\bigg(-2\log x\bigg)=\frac{1}{x^2}. \\
            y=\frac{1}{I}\int Iq\,dx=x^2\int \frac{1}{x^2}3x^3\,dx =x^2\int 3x\,dx=x^2\bigg(\frac{3}{2}x^2+c\bigg) =\frac{3}{2}x^4+cx^2.
        \end{gathered}\]

Using \(y(-1)=2\) we have \(2=\frac{3}{2}+c\), hence \(c=\frac{1}{2}\),
giving \(y=\frac{3}{2}x^4+\frac{1}{2}x^2.\)
:::

::: {.container-fluid .que .stack data-qid="1st order ODE -- Linear"}
:::

## First order exact ODEs

An alternative form in which to write a first order ODE is
\[\label{eq:AFOO}
    M(x,y)\,dx+N(x,y)\,dy=0. \tag{$\star\star$}\]

Rearranging gives \[\frac{dy}{dx}=-\frac{M(x,y)}{N(x,y)},\] so this
agrees with the form \(\eqref{eq:GFOO}\) with
\(f(x,y)=\frac{M(x,y)}{N(x,y)}\).

Note that a given \(f(x,y)\) does not correspond to a unique choice of
\(M(x,y)\) and \(N(x,y)\) as only their ratio determines the ODE, so
there is a freedom to multiply both \(M\) and \(N\) by the same
arbitrary function.\
For any function \(g(x,y)\) the **total differential** \(dg\) is defined
to be
\[dg=\frac{\partial g}{\partial x}\,dx+\frac{\partial g}{\partial y}\,dy.\]
You may think of \(dg\) as the small change in the function \(g\) that
arises in moving from the point \((x,y)\) to \((x+dx,y+dy)\) where
\(dx\) and \(dy\) are both small. In particular, if \(dg\) is
identically zero then \(g\) is a constant.\
The ODE \(\eqref{eq:AFOO}\) is called **exact** if there exists a
function \(g(x,y)\) such that the left hand side of \(\eqref{eq:AFOO}\)
is equal to the total derivative \(dg\) ie.
\[M=\frac{\partial g}{\partial x} \quad \text{and} \quad N=\frac{\partial g}{\partial y}.\]
In this case the ODE says that \(dg=0\) hence \(g=constant\) and this
yields the solution of the ODE.\
The equality of the mixed partial derivatives
\(\frac{\partial^2 g}{\partial y\partial x}= \frac{\partial^2 g}{\partial x\partial y}\)
requires that an exact equation satisfies
\(\frac{\partial M}{\partial y}=\frac{\partial N}{\partial x}\).

This results in the following **test for exactness**
\[\text{The ODE} \quad M(x,y)\,dx+N(x,y)\,dy=0 \quad \text{is exact iff} \quad \frac{\partial M}{\partial y}=\frac{\partial N}{\partial x}.\]

::: example
**Example 6**. Show that \[(3e^{3x}y+e^x)\,dx+(e^{3x}+1)\,dy=0\] is an
exact equation, and hence solve it.

In this example \(M=3e^{3x}y+e^x\) and \(N=e^{3x}+1.\)

\(\frac{\partial M}{\partial y}=3e^{3x}=\frac{\partial N}{\partial x}\)
hence this equation is exact.

\[\text{From} \ M=\frac{\partial g}{\partial x}\ \text{we have} \ \frac{\partial g}{\partial x}=3e^{3x}y+e^x \quad \text{giving } \ g=e^{3x}y+e^x+\phi(y),\]
where the usual constant of integration is replaced by an arbitrary
function of integration \(\phi(y)\) because of the partial
differentiation. To determine this function we use \[\begin{gathered}
            \frac{\partial g}{\partial y}=N, \quad \frac{\partial g}{\partial y}=e^{3x}+1=e^{3x}+\phi', \quad \text{so} \ \phi'=1, \ \text{giving} \ \phi=y. \\
            \text{Finally we have that}\quad g=e^{3x}y+e^x+y=\text{constant}=c.
        \end{gathered}\]

In this case we can write the solution in explicit form
\(y={(c-e^x)}/{(e^{3x}+1)}.\)

As an exercise check that this does indeed solve the starting ODE
\[y'=-(3e^{3x}y+e^x)/(e^{3x}+1).\] Note that this example is also a
linear ODE, so could also have been solved using an integrating factor.\
:::

Consider an ODE \(M\,dx+N\,dy=0\) that is not exact ie.
\(\frac{\partial M}{\partial y}\ne\frac{\partial N}{\partial x}.\)

By multiplying the ODE by a function \(I(x,y)\) we can get an equivalent
representation of the ODE as \(m\,dx+n\,dy=0\) where \(m=MI\) and
\(n=NI.\) If this equation is exact ie.
\(\frac{\partial m}{\partial y}=\frac{\partial n}{\partial x}\) then
\(I\) is called an **integrating factor** for the original ODE.\

::: example
**Example 7**. Show that \(x\) is an integrating factor for
\[(3xy-y^2)\,dx+x(x-y)\, dy=0.\]

\(M=3xy-y^2\)  so  \(\frac{\partial M}{\partial y}=3x-2y,\) but
\(N=x^2-xy\)  so  \(\frac{\partial N}{\partial x}=2x-y.\)

Therefore
 \(\frac{\partial M}{\partial y}\ne \frac{\partial N}{\partial x}\) and
the ODE is not exact.

However, with the integrating factor \(I=x\) we get \(m=MI=3x^2y-y^2x\)
and \(n=NI=x^3-x^2y\) so now
\(\frac{\partial m}{\partial y}=3x^2-2yx= \frac{\partial n}{\partial x}\)
which is exact.

We can now solve this exact equation using the above method.

\(\frac{\partial g}{\partial x}=m=3x^2y-y^2x\)  giving
\(g=x^3y-\frac{1}{2}y^2x^2+\phi(y).\)

\(\frac{\partial g}{\partial y}=n=x^3-x^2y=x^3-x^2y+\phi'\) so
 \(\phi'=0\) and we can take \(\phi=0.\)

This gives the final solution \(g=\text{constant}=c\)  ie.
 \(x^3y-\frac{1}{2}y^2x^2=c.\)
:::

## Bernoulli equations

A **Bernoulli equation** is a nonlinear ODE of the form
\[y'+p(x)y=q(x)y^n\] where \(n\ne 0,1,\) otherwise the equation is
simply linear.\
These ODEs can be solved by first performing the substitution
\(v=y^{1-n}\), which converts the equation to a linear ODE for
\(v(x)\).\

::: example
**Example 8**. Solve \[y'-\frac{2y}{x}=-x^2y^2.\]

This is a Bernoulli equation with \(n=2\) hence put \(v=\frac{1}{y},\)
 which gives \(v'=-\frac{y'}{y^2}.\)

Dividing the ODE by \(y^2\) yields \[\frac{y'}{y^2}-\frac{2}{xy}=-x^2\]
which in terms of \(v\) is \[-v'-\frac{2v}{x}=-x^2\]  ie  the linear
equation \[v'+\frac{2}{x}v=x^2.\] We solve this with an integrating
factor \(I=\exp\bigg(\int \frac{2}{x}\, dx\bigg)=\exp(2\log x)=x^2\) as
\[v=\frac{1}{x^2}\int x^2 x^2\, dx =\frac{1}{x^2}\bigg(\frac{1}{5}x^5+\frac{c}{5}\bigg).\]
So finally \[y=\frac{1}{v}=\frac{5x^2}{x^5+c}.\]
:::

## Summary: First order ODEs

You should have a good understanding of how to solve the various types
of first order ODEs we covered. We assume a first order ODE can be
written in the form \(\frac{dy}{dx} = f(x,y)\). Here are some key
points:

- The *general solution* to a first order ODE will have 1 free real
  parameter which we can call the integration constant. If we are given
  an *initial condition* determining the value of \(y\) for some
  specific value of \(x\) then we can fix this integration constant.

- Often when solving an ODE we will get an *implicit solution*, i.e. and
  algebraic expression involving \(x\) and \(y\). If it is reasonably
  straightforward to do so, solve this to write an *explicit solution*,
  i.e. an explicit expression for \(y(x)\) as a function of \(x\).

- If \(f(x,y) = X(x)Y(y)\) the ODE is *separable*. Solve by separating
  the \(x\) and \(y\) dependence and integrating:
  \(\int \frac{dy}{Y} = \int X dx\).

- If \(f(tx, ty) = f(x,y)\) for all \(x, y, t \in \mathbb{R}\) then the
  ODE is *first order homogeneous*. Solve by substituting \(v = y/x\)
  for \(y\) and the OPE will become separable in variables \(x\) and
  \(v\). Remember to substitute back after solving to give the solution
  for the original variable \(y\).

- If \(f(x,y) = -p(x)y + q(x)\), i.e. if \(f(x,y)\) is linear in \(y\),
  we have a *linear first order ODE* which can be written as
  \(y + py' = q\). We can solve by multiplying both sides by an
  *integrating factor* \(I = \exp(\int p(x) dx)\) so that the LHS
  becomes the total derivative \((Iy)'\) and we then solve by
  integrating the RHS \(Iq\).

- A *Bernoulli equation* is a first order ODE of the form
  \(y + p(x) y' = q(x) y^n\) with any \(n \in \mathbb{R}\ \{0, 1\}\)
  where we exclude those values of \(n\) for which this is just a linear
  ODE. We solve by dividing both sides by \(y^n\) and substituting
  \(v = y^{1-n}\) which results in a first order linear ODE for
  \(v(x)\).

- A first order *exact ODE* is one of the form
  \(M(x,y) dx + N(x,y) dy = 0\) with
  \(\frac{\partial M}{\partial y} = \frac{\partial N}{\partial x}\)
  which means we can write \(M = \frac{\partial g}{\partial x}\) and
  \(N = \frac{\partial g}{\partial y}\) for such function \(g(x,y)\).
  The ODE is then simply \(dg = 0\) which means that \(g(x,y) = c\) for
  some \(c \in \mathbb{R}\). To find \(g\) either integrate \(M\)
  wrt. \(x\) while treating \(y\) as a constant or integrate \(N\)
  wrt. \(y\) while treating \(x\) as a constant. The integration will
  give \(g(x,y)\) up to an integration 'constant' which is an arbitrary
  function of \(y\) and \(x\) respectively (since these were treated as
  constants in the integration). Fix this integration 'constant' up to a
  real constant by substituting the expression for \(g\) into the other
  equation, \(N = \frac{\partial g}{\partial y}\) or
  \(M = \frac{\partial g}{\partial x}\) respectively.

- We can write a first order ODE in the form
  \(M(x,y) dx + N(x,y) dy = 0\) in infinitely many ways since we can
  multiply through by any function \(I(x,y)\). In general this will not
  be an exact ODE but it can be for specific *integrating factors*
  \(I(x,y)\). Unfortunately there is no general method to finding these
  integrating factors (unlike the integrating factor for linear ODEs).
  There are some methods which work in some cases, but we did not cover
  that this term, so you just need to know the concept.
