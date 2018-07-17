const e = document.querySelector(".navbar-toggler");
const t = document.querySelector(".navbar-collapse");

e.onclick = function()
{
    if (e.getAttribute("aria-expanded") == "false")
    {
        t.classList.remove('collapse');
        e.setAttribute('aria-expanded', true);
    }
    else
    {
        e.setAttribute("aria-expanded", false);
        t.classList.add('collapse');
    }
}