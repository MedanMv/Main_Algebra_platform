from bs4 import BeautifulSoup

# Your HTML input
html_content = """
<table>
<tr><th>#</th><th>Theme</th><th>Formula</th><th>Check</th></tr>
<tr><td>1</td><td>Пропорція </td><td>a/b=c/d</td><td><input type="checkbox" class="formula-check-1 grade-6"></td></tr>
<tr><td>2</td><td>Пропорція </td><td>ad=bc</td><td><input type="checkbox" class="formula-check-2 grade-6"></td></tr>
<tr><td>3</td><td>Дроби</td><td>a/c+b/c=(a+b)/c</td><td><input type="checkbox" class="formula-check-3 grade-6"></td></tr>
<tr><td>4</td><td>Дроби</td><td>a/c-b/c=(a-b)/c</td><td><input type="checkbox" class="formula-check-4 grade-6"></td></tr>
<tr><td>5</td><td>Дроби</td><td>a/b·c/d=(a·c)/(b·d)</td><td><input type="checkbox" class="formula-check-5 grade-6"></td></tr>
<tr><td>6</td><td>Дроби</td><td>(a/b)/(c/d)=(a/b)·(d/c)=(a·d)/(b·c)</td><td><input type="checkbox" class="formula-check-6 grade-6"></td></tr>
<tr><td>7</td><td> Пропорційна залежність</td><td>y=k·x</td><td><input type="checkbox" class="formula-check-7 grade-6"></td></tr>
<tr><td>8</td><td> Пропорційна залежність</td><td>y=k/x</td><td><input type="checkbox" class="formula-check-8 grade-6"></td></tr>
<tr><td>9</td><td>Відсотки</td><td>a=(b·100)/p</td><td><input type="checkbox" class="formula-check-9 grade-6"></td></tr>
<tr><td>10</td><td>Відсотки</td><td>1%=a·(<span class="frac"><sup>1</sup>/<sub>100</sub></span>)</td><td><input type="checkbox" class="formula-check-10 grade-6"></td></tr>
<tr><td>11</td><td>Відсотки</td><td>p%=a·(p/100)</td><td><input type="checkbox" class="formula-check-11 grade-6"></td></tr>
<tr><td>12</td><td>Модуль</td><td>|-a|=a</td><td><input type="checkbox" class="formula-check-12 grade-6"></td></tr>
<tr><td>13</td><td>Модуль</td><td>|a|=a, a>=0</td><td><input type="checkbox" class="formula-check-13 grade-6"></td></tr>
<tr><td>14</td><td>Модуль</td><td>|ab|=|a|·|b|</td><td><input type="checkbox" class="formula-check-14 grade-6"></td></tr>
<tr><td>15</td><td>Модуль</td><td>|a|=-a, a<0</td><td><input type="checkbox" class="formula-check-15 grade-6"></td></tr>
<tr><td>16</td><td>Віднімання раціональних чисел</td><td>a-b=a+(-b)</td><td><input type="checkbox" class="formula-check-16 grade-6"></td></tr>
<tr><td>17</td><td>Винесення спільного множника за дужки</td><td>a·b=b·a</td><td><input type="checkbox" class="formula-check-17 grade-6"></td></tr>
<tr><td>18</td><td>Винесення спільного множника за дужки</td><td>(a·b)·c=a·(b·c)</td><td><input type="checkbox" class="formula-check-18 grade-6"></td></tr>
<tr><td>19</td><td>Винесення спільного множника за дужки</td><td>(a+b)·c = a·c+b·c</td><td><input type="checkbox" class="formula-check-19 grade-6"></td></tr>
</table>
<h2>Grade 7 <input type="checkbox" id="grade-check-7" onclick="toggleGrade(7)"></h2>
<table>
<tr><th>#</th><th>Theme</th><th>Formula</th><th>Check</th></tr>
<tr><td>20</td><td>Степінь з натуральним показником</td><td>a<sup>n</sup>=a·a·….·a, n>1</td><td><input type="checkbox" class="formula-check-20 grade-7"></td></tr>
<tr><td>21</td><td>Степінь з натуральним показником</td><td>a<sup>1</sup>=a</td><td><input type="checkbox" class="formula-check-21 grade-7"></td></tr>
<tr><td>22</td><td>Властивості степеня</td><td>a<sup>n</sup>·a<sup>m</sup>=a^(n+m)</td><td><input type="checkbox" class="formula-check-22 grade-7"></td></tr>
<tr><td>23</td><td>Властивості степеня</td><td>(a<sup>n</sup>)/a<sup>m</sup>=a^(n−m)</td><td><input type="checkbox" class="formula-check-23 grade-7"></td></tr>
<tr><td>24</td><td>Властивості степеня</td><td>(a<sup>n</sup>)^m=a^(n·m)</td><td><input type="checkbox" class="formula-check-24 grade-7"></td></tr>
<tr><td>25</td><td>Властивості степеня</td><td>(ab)^n=a<sup>n</sup>·b<sup>n</sup></td><td><input type="checkbox" class="formula-check-25 grade-7"></td></tr>
<tr><td>26</td><td>Властивості степеня</td><td>(a/b)^n=a<sup>n</sup>/b<sup>n</sup></td><td><input type="checkbox" class="formula-check-26 grade-7"></td></tr>
<tr><td>27</td><td> Формули скороченого множення</td><td>(a+b)^2=a<sup>2</sup>+2ab+b<sup>2</sup></td><td><input type="checkbox" class="formula-check-27 grade-7"></td></tr>
<tr><td>28</td><td> Формули скороченого множення</td><td>(a−b)^2=a<sup>2</sup>−2ab+b<sup>2</sup></td><td><input type="checkbox" class="formula-check-28 grade-7"></td></tr>
<tr><td>29</td><td> Формули скороченого множення</td><td>(a−b)(a+b)=a<sup>2</sup>−b<sup>2</sup></td><td><input type="checkbox" class="formula-check-29 grade-7"></td></tr>
<tr><td>30</td><td> Формули скороченого множення</td><td>a<sup>3</sup>+b<sup>3</sup>=(a+b)(a<sup>2</sup>-ab+b<sup>2</sup>)</td><td><input type="checkbox" class="formula-check-30 grade-7"></td></tr>
<tr><td>31</td><td> Формули скороченого множення</td><td>a<sup>3</sup>-b<sup>3</sup>=(a-b)(a<sup>2</sup>+ab+b<sup>2</sup>)</td><td><input type="checkbox" class="formula-check-31 grade-7"></td></tr>
<tr><td>32</td><td>Лінійні рівняння з однією змінною</td><td>ax=b</td><td><input type="checkbox" class="formula-check-32 grade-7"></td></tr>
<tr><td>33</td><td>Лінійні рівняння з однією змінною</td><td>x=a/b, a<>0</td><td><input type="checkbox" class="formula-check-33 grade-7"></td></tr>
<tr><td>34</td><td>Лінійні рівняння з однією змінною</td><td>0x=b, a=0</td><td><input type="checkbox" class="formula-check-34 grade-7"></td></tr>
</table>
<h2>Grade 8 <input type="checkbox" id="grade-check-8" onclick="toggleGrade(8)"></h2>
<table>
<tr><th>#</th><th>Theme</th><th>Formula</th><th>Check</th></tr> 
<tr><td>39</td><td>Квадратні рівняння</td><td>ax<sup>2</sup>+bx+c=0</td><td><input type="checkbox" class="formula-check-39 grade-8"></td></tr>
<tr><td>40</td><td>Квадратні рівняння</td><td>D=b<sup>2</sup>-4ac</td><td><input type="checkbox" class="formula-check-40 grade-8"></td></tr>
<tr><td>41</td><td>Квадратні рівняння</td><td>x1=(-b+sqrt(D))/(2a)</td><td><input type="checkbox" class="formula-check-41 grade-8"></td></tr>
<tr><td>42</td><td>Квадратні рівняння</td><td>x2=(-b-sqrt(D))/(2a)</td><td><input type="checkbox" class="formula-check-42 grade-8"></td></tr>
<tr><td>43</td><td>Квадратні рівняння</td><td>ax<sup>2</sup>+bc+c=a(x-x1)(x-x2)</td><td><input type="checkbox" class="formula-check-43 grade-8"></td></tr>
<tr><td>44</td><td>Арифметичний квадратний корінь</td><td>(sqrt(a))^2=a (a>=0)</td><td><input type="checkbox" class="formula-check-44 grade-8"></td></tr>
<tr><td>45</td><td>Арифметичний квадратний корінь</td><td>(sqrt(a)^2)=|a|</td><td><input type="checkbox" class="formula-check-45 grade-8"></td></tr>
<tr><td>46</td><td>Арифметичний квадратний корінь</td><td>sqrt(a·b)=sqrt(a)·sqrt(b)</td><td><input type="checkbox" class="formula-check-46 grade-8"></td></tr>
<tr><td>47</td><td>Арифметичний квадратний корінь</td><td>sqrt(a/b)=sqrt(a)/sqrt(b)</td><td><input type="checkbox" class="formula-check-47 grade-8"></td></tr>
<tr><td>48</td><td>Арифметичний квадратний корінь</td><td>sqrt(a<sup>2</sup>-b<sup>2</sup>)=sqrt(a-b)(a+b)</td><td><input type="checkbox" class="formula-check-48 grade-8"></td></tr>
<tr><td>49</td><td>Степінь з від'ємним показником</td><td>a^(-n)=1/(a<sup>n</sup>)</td><td><input type="checkbox" class="formula-check-49 grade-8"></td></tr>
</table>
<h2>Grade 9 <input type="checkbox" id="grade-check-9" onclick="toggleGrade(9)"></h2>
<table>
<tr><th>#</th><th>Theme</th><th>Formula</th><th>Check</th></tr>
<tr><td>50</td><td>Нерівності</td><td>a>b, c>d</td><td><input type="checkbox" class="formula-check-50 grade-9"></td></tr>
<tr><td>51</td><td>Нерівності</td><td>a+c>b+d</td><td><input type="checkbox" class="formula-check-51 grade-9"></td></tr>
<tr><td>52</td><td>Нерівності</td><td>ac>bd</td><td><input type="checkbox" class="formula-check-52 grade-9"></td></tr>
<tr><td>53</td><td>Арифметична прогресія</td><td>an=a1+d·(n-1)</td><td><input type="checkbox" class="formula-check-53 grade-9"></td></tr>
<tr><td>54</td><td>Арифметична прогресія</td><td>an=(a(n-1)+a(n+1))/2</td><td><input type="checkbox" class="formula-check-54 grade-9"></td></tr>
<tr><td>55</td><td>Арифметична прогресія</td><td>Sn=((a1+an)·n)/2</td><td><input type="checkbox" class="formula-check-55 grade-9"></td></tr>
<tr><td>56</td><td>Арифметична прогресія</td><td>Sn=((2a1+d·(n-1))·n)/2</td><td><input type="checkbox" class="formula-check-56 grade-9"></td></tr>
<tr><td>57</td><td>Арифметична прогресія</td><td>a(n+1)=an+d</td><td><input type="checkbox" class="formula-check-57 grade-9"></td></tr>
<tr><td>58</td><td>Геометрична прогресія</td><td>bn=b1·q^(n-1)</td><td><input type="checkbox" class="formula-check-58 grade-9"></td></tr>
<tr><td>59</td><td>Геометрична прогресія</td><td>(bn)^2=b(n-1)·b(n+1)</td><td><input type="checkbox" class="formula-check-59 grade-9"></td></tr>
<tr><td>60</td><td>Геометрична прогресія</td><td>Sn=(b1·(q<sup>n</sup>-1))/(q-1)</td><td><input type="checkbox" class="formula-check-60 grade-9"></td></tr>
<tr><td>61</td><td>Геометрична прогресія</td><td>b(n+1)=bn·q</td><td><input type="checkbox" class="formula-check-61 grade-9"></td></tr>
<tr><td>62</td><td>Геометрична прогресія</td><td>S=b1/(1-q)</td><td><input type="checkbox" class="formula-check-62 grade-9"></td></tr>
<tr><td>63</td><td>Ймовірність</td><td>P(A)=m/n</td><td><input type="checkbox" class="formula-check-63 grade-9"></td></tr>
</table>
<h2>Grade 10 <input type="checkbox" id="grade-check-10" onclick="toggleGrade(10)"></h2>
<table>
<tr><th>#</th><th>Theme</th><th>Formula</th><th>Check</th></tr>
<tr><td>64</td><td>Корінь n-го степеня</td><td>root((sqrt(a))^(2k+1), 2k+1)=a</td><td><input type="checkbox" class="formula-check-64 grade-10"></td></tr>
<tr><td>65</td><td>Корінь n-го степеня</td><td>root(ab, n)=root(a, n)·root(b, n)</td><td><input type="checkbox" class="formula-check-65 grade-10"></td></tr>
<tr><td>66</td><td>Корінь n-го степеня</td><td>root(a/b, n)=(root(a, n))/(root(b,n))</td><td><input type="checkbox" class="formula-check-66 grade-10"></td></tr>
<tr><td>67</td><td>Корінь n-го степеня</td><td>(root(a, n))^k=root(a<sup>k</sup>, n)</td><td><input type="checkbox" class="formula-check-67 grade-10"></td></tr>
<tr><td>68</td><td>Корінь n-го степеня</td><td>root(root(a, k), n)=root(a, nk)</td><td><input type="checkbox" class="formula-check-68 grade-10"></td></tr>
<tr><td>69</td><td>Корінь n-го степеня</td><td>root(a<sup>k</sup>, nk)=root(a, n)</td><td><input type="checkbox" class="formula-check-69 grade-10"></td></tr>
<tr><td>70</td><td>Тригонометричні функції(властивості)</td><td>tg(x)=sin(x)/cos(x)</td><td><input type="checkbox" class="formula-check-70 grade-10"></td></tr>
<tr><td>71</td><td>Тригонометричні функції(властивості)</td><td>sin(x)=sin(x+2pin)</td><td><input type="checkbox" class="formula-check-71 grade-10"></td></tr>
<tr><td>72</td><td>Тригонометричні функції(властивості)</td><td>cos(x)=cos(x+2pin)</td><td><input type="checkbox" class="formula-check-72 grade-10"></td></tr>
<tr><td>73</td><td>Тригонометричні функції(властивості)</td><td>tg(x)=tg(x+pin)</td><td><input type="checkbox" class="formula-check-73 grade-10"></td></tr>
<tr><td>74</td><td>Тригонометричні функції(властивості)</td><td>cos(-x)=cos(x)</td><td><input type="checkbox" class="formula-check-74 grade-10"></td></tr>
<tr><td>75</td><td>Тригонометричні функції(властивості)</td><td>sin(-x)=-sin(x)</td><td><input type="checkbox" class="formula-check-75 grade-10"></td></tr>
<tr><td>76</td><td>Тригонометричні функції(властивості)</td><td>sin<sup>2</sup>(x)+cos<sup>2</sup>(x)=1</td><td><input type="checkbox" class="formula-check-76 grade-10"></td></tr>
<tr><td>77</td><td>Тригонометричні функції(властивості)</td><td>1+tg<sup>2</sup>(x)=1/(cos<sup>2</sup>(x)</td><td><input type="checkbox" class="formula-check-77 grade-10"></td></tr>
<tr><td>78</td><td>Формули додавання</td><td>cos(x-y)=cos(x)·cos(y)+sin(x)·sin(y)</td><td><input type="checkbox" class="formula-check-78 grade-10"></td></tr>
<tr><td>79</td><td>Формули додавання</td><td>cos(x+y)=cos(x)·cos(y)−sin(x)·sin(y)</td><td><input type="checkbox" class="formula-check-79 grade-10"></td></tr>
<tr><td>80</td><td>Формули додавання</td><td>sin(x+y)=sin(x)·cos(y)+cos(x)·sin(y)</td><td><input type="checkbox" class="formula-check-80 grade-10"></td></tr>
<tr><td>81</td><td>Формули додавання</td><td>sin(x−y)=sin(x)·cos(y)−cos(x)·sin(y)</td><td><input type="checkbox" class="formula-check-81 grade-10"></td></tr>
<tr><td>82</td><td>Формули додавання</td><td>tg(x+y)=(tg(x)+tg(y))/(1-tg(x)·tg(y))</td><td><input type="checkbox" class="formula-check-82 grade-10"></td></tr>
<tr><td>83</td><td>Формули додавання</td><td>tg(x-y)=(tg(x)-tg(y))/(1+tg(x)·tg(y))</td><td><input type="checkbox" class="formula-check-83 grade-10"></td></tr>
<tr><td>84</td><td>Формули додавання</td><td>cos(2x)=cos<sup>2</sup>(x)-sin<sup>2</sup>(x)</td><td><input type="checkbox" class="formula-check-84 grade-10"></td></tr>
<tr><td>85</td><td>Формули додавання</td><td>cos(2x)=2·cos<sup>2</sup>(x)-1</td><td><input type="checkbox" class="formula-check-85 grade-10"></td></tr>
<tr><td>86</td><td>Формули додавання</td><td>cos(2x)=1-2·sin<sup>2</sup>(x)</td><td><input type="checkbox" class="formula-check-86 grade-10"></td></tr>
<tr><td>87</td><td>Формули додавання</td><td>sin(2x)=2·sin(x)·cos(x)</td><td><input type="checkbox" class="formula-check-87 grade-10"></td></tr>
<tr><td>88</td><td>Рівняння</td><td>cos(x)=b</td><td><input type="checkbox" class="formula-check-88 grade-10"></td></tr>
<tr><td>89</td><td>Рівняння</td><td>x=+-arccos(b)+2pin</td><td><input type="checkbox" class="formula-check-89 grade-10"></td></tr>
<tr><td>90</td><td>Рівняння</td><td>sin(x)=b</td><td><input type="checkbox" class="formula-check-90 grade-10"></td></tr>
<tr><td>91</td><td>Рівняння</td><td>x=((-1)^n)·arcsin(b)+pin</td><td><input type="checkbox" class="formula-check-91 grade-10"></td></tr>
<tr><td>92</td><td>Рівняння</td><td>tg(x)=b</td><td><input type="checkbox" class="formula-check-92 grade-10"></td></tr>
<tr><td>93</td><td>Рівняння</td><td>x=arctg(b)+pin</td><td><input type="checkbox" class="formula-check-93 grade-10"></td></tr>
<tr><td>94</td><td>Рівняння</td><td>ctg(x)=b</td><td><input type="checkbox" class="formula-check-94 grade-10"></td></tr>
<tr><td>95</td><td>Рівняння</td><td>x=arcctg(b)+pin</td><td><input type="checkbox" class="formula-check-95 grade-10"></td></tr>
<tr><td>96</td><td>Правила диферінцювання</td><td>(f+g)'=f'+g'</td><td><input type="checkbox" class="formula-check-96 grade-10"></td></tr>
<tr><td>97</td><td>Правила диферінцювання</td><td>(f·g)'=f'·g'+f'·g'</td><td><input type="checkbox" class="formula-check-97 grade-10"></td></tr>
<tr><td>98</td><td>Правила диферінцювання</td><td>(f/g)'=(f'·g-f·g')/g<sup>2</sup></td><td><input type="checkbox" class="formula-check-98 grade-10"></td></tr>
</table>
<h2>Grade 11 <input type="checkbox" id="grade-check-11" onclick="toggleGrade(11)"></h2>
<table>
<tr><th>#</th><th>Theme</th><th>Formula</th><th>Check</th></tr>
<tr><td>99</td><td>Логарифми</td><td>log_a(b·c)=log_a(b)+log_a©</td><td><input type="checkbox" class="formula-check-99 grade-11"></td></tr>
<tr><td>100</td><td>Логарифми</td><td>log_a(b/c)=log_a(b)-log_a(c)</td><td><input type="checkbox" class="formula-check-100 grade-11"></td></tr>
<tr><td>101</td><td>Логарифми</td><td>log_a(b<sup>c</sup>)=c·log_a(b)</td><td><input type="checkbox" class="formula-check-101 grade-11"></td></tr>
<tr><td>102</td><td>Логарифми</td><td>log_a(root(b), n)=(log_a(b))/n</td><td><input type="checkbox" class="formula-check-102 grade-11"></td></tr>
</table>
"""

# Parse the HTML using BeautifulSoup
# Parse the HTML using BeautifulSoup
soup = BeautifulSoup(html_content, "html.parser")

# Initialize the formulasTable dictionary
formulas_table = {}

# Loop through all rows across multiple tables
tables = soup.find_all("table")  # Find all tables
for table in tables:
    rows = table.find_all("tr")[1:]  # Skip the header row
    for row in rows:
        cells = row.find_all("td")
        if len(cells) == 4:  # Ensure the row has all necessary cells
            # Extract data from the row
            # Join all class attributes instead of picking just the first one
            class_attr = " ".join(cells[3].find("input")["class"])  # Extract full class attribute
            theme = cells[1].text.strip()  # Extract theme
            formula = cells[2].text.strip()  # Extract formula

            # Add to the formulasTable dictionary
            formulas_table[class_attr] = {
                "theme": theme,
                "formula": formula
            }

# Print the formatted JavaScript object
print("const formulasTable = {")
for class_attr, details in formulas_table.items():
    print(f'    "{class_attr}": {{ theme: "{details["theme"]}", formula: "{details["formula"]}" }},')
print("};")
