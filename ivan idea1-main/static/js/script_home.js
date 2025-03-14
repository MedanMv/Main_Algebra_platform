    document.getElementById('add-class').textContent = '+';

    document.addEventListener('DOMContentLoaded', function () {
        fetch('/get_classes')
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    data.classes.forEach(classObj => {
                        addClassToUI(classObj.name, classObj.id, classObj.uuid);
                    });
                } else {
                    console.error("Failed to load classes:", data.message);
                }
            })
            .catch(error => console.error("Error fetching classes:", error));
    });
    
    // Function to add classes dynamically
    function addClassToUI(className, classId, classUUID) {
        let li = document.createElement('li');
        li.textContent = className;
        li.setAttribute('data-class-id', classId);
        li.setAttribute('data-uuid', classUUID); // Store UUID
        li.style.border = '2px solid #808080';
    
        let deleteBtn = document.createElement('span');
        deleteBtn.classList.add('delete-btn');
        deleteBtn.textContent = 'Видалити';
    
        deleteBtn.addEventListener('click', function (event) {
            event.stopPropagation();
            if (confirm('Ви впевнені, що хочете видалити цей клас?')) {
                let classId = li.getAttribute('data-class-id');
    
                fetch('/delete_class', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: classId })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        li.remove(); // Remove from UI only if backend confirms deletion
                        clearClassInterface();
                    } else {
                        alert(data.message);
                    }
                })
                .catch(error => console.error('Error:', error));
            }
        });
    
        li.appendChild(deleteBtn);
        li.addEventListener('click', function () {
            let uuid = li.getAttribute('data-uuid'); // Get UUID
            openClassInterface(className, uuid); // Pass it to openClassInterface
        });
    
        document.getElementById('class-list').appendChild(li);
    }
    
    function toggleGrade(grade, classUUID) {
        // Get the grade-level checkbox
        let gradeCheckbox = document.getElementById(`grade-check-${grade}`);
    
        // Get all formula checkboxes associated with this grade
        let formulaCheckboxes = document.querySelectorAll(`.grade-${grade}`);
    
        // Update the state of all formulas based on the grade checkbox
        formulaCheckboxes.forEach(checkbox => {
            checkbox.checked = gradeCheckbox.checked;
        });
    
        // Collect updated checkbox states
        const checkboxStates = {};
        formulaCheckboxes.forEach(checkbox => {
            checkboxStates[checkbox.className] = checkbox.checked;
        });
        checkboxStates[`grade-check-${grade}`] = gradeCheckbox.checked;
    
        // Send updated states to the backend
        fetch('/update_checkbox_states', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                class_uuid: classUUID,
                checkbox_states: checkboxStates
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log(`Grade ${grade} checkbox states updated for class ${classUUID}`);
            } else {
                console.error(`Failed to update checkbox states for Grade ${grade}:`, data.message);
            }
        })
        .catch(error => {
            console.error(`Error updating states for class ${classUUID}:`, error);
        });
    }
    
    

    const modal = document.createElement('div');
    modal.classList.add('modal');
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close">&times;</span>
            <h2>Виберіть дію</h2>
            <button id="create-class-btn">Створити клас</button>
            <button id="join-class-btn">Приєднатися до класу</button>
        </div>
    `;
    document.body.appendChild(modal);

    const actionModal = document.createElement('div');
    actionModal.classList.add('modal');
    actionModal.innerHTML = `
        <div class="modal-content">
            <span class="close">&times;</span>
            <h2 id="modal-title"></h2>
            <input type="text" id="modal-input" placeholder="Введіть дані">
            <button id="modal-confirm">ОК</button>
        </div>
    `;
    document.body.appendChild(actionModal);

    document.getElementById('add-class').addEventListener('click', function () {
        modal.style.display = 'flex';
    });

    modal.querySelector('.close').addEventListener('click', function () {
        modal.style.display = 'none';
    });
    actionModal.querySelector('.close').addEventListener('click', function () {
        actionModal.style.display = 'none';
    });

    function openActionModal(title, callback) {
        document.getElementById('modal-title').textContent = title;
        document.getElementById('modal-input').value = '';
        actionModal.style.display = 'flex';
        document.getElementById('modal-confirm').onclick = function () {
            callback(document.getElementById('modal-input').value);
            actionModal.style.display = 'none';
        };
    }

    function createClass(className) {
        if (className) {
            fetch('/create_class', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ class_name: className })
            })
            .then(response => response.json())
            .then(data => { 
                if (data.success) {
                    location.reload();
                    let li = document.createElement('li');
                    li.textContent = className;
                    li.setAttribute('data-class-id', data.class_id);
                    li.style.border = '2px solid #808080';
    
                    let deleteBtn = document.createElement('span');
                    deleteBtn.classList.add('delete-btn');
                    deleteBtn.textContent = 'Видалити';
    
                    deleteBtn.addEventListener('click', function (event) {
                        event.stopPropagation();
                        if (confirm('Ви впевнені, що хочете видалити цей клас?')) {
                            li.remove();
                            clearClassInterface();
                        }
                    });
    
                    li.appendChild(deleteBtn);
                    li.addEventListener('click', function () {
                        openClassInterface(className);
                    });
    
                    document.getElementById('class-list').appendChild(li);
                } else {
                    alert(data.message);
                }
            })
            .catch(error => console.error('Error:', error));
        }
    }
    

    modal.querySelector('#create-class-btn').addEventListener('click', function () {
        modal.style.display = 'none';
        openActionModal('Введіть назву класу:', createClass);
    });

    modal.querySelector('#join-class-btn').addEventListener('click', function () {
        modal.style.display = 'none';
        
        openActionModal('Введіть код класу:', function (classCode) {
            if (!classCode) {
                alert("Код класу не може бути порожнім!"); // Alert if no code is entered
                return;
            }
    
            // Send the class code (UUID) to the backend for validation
            fetch('/join_class', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ class_uuid: classCode }) // Pass the entered class code
            })
            .then(response => response.json())
            .then(data => { 
                if (data.success) {
                    // Redirect to session.html if session_active is 1
                    localStorage.setItem('class_uuid', classCode);

                    window.location.href = '/session';
                } else {
                    // Show an error if session is inactive or class code is invalid
                    alert(data.message);
                }
            })
            .catch(error => {
                console.error("Error processing join request:", error);
                alert("Сталася помилка. Спробуйте ще раз.");
            });
        });
    });
    

    // Function to handle checkbox state changes
    function monitorCheckboxStates(classUUID) {
        console.log("Class UUID:", classUUID);
        
        const checkboxes = document.querySelectorAll('input[type="checkbox"][class^="formula-check"]');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', function () {
                const checkboxStates = {};
    
                // Capture the state of all checkboxes
                checkboxes.forEach(box => {
                    checkboxStates[box.className] = box.checked; // Use the class name as the key
                });
    
                // Send updated states to the backend
                fetch('/update_checkbox_states', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        class_uuid: classUUID, // Pass the classUUID
                        checkbox_states: checkboxStates // Send the updated states
                    })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        console.log('Checkbox states updated successfully!');
                    } else {
                        console.error('Failed to update checkbox states:', data.message);
                    }
                })
                .catch(error => console.error('Error updating checkbox states:', error));
            });
        });
        
    }
    
    
    function loadCheckboxStates(classUUID) {
        fetch(`/get_checkbox_states?class_uuid=${classUUID}`)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    const checkboxStates = data.checkbox_states || {}; // Default to an empty object
                    const checkboxes = document.querySelectorAll('input[type="checkbox"][class^="formula-check"]');
                    checkboxes.forEach(box => {
                        box.checked = checkboxStates[box.className] || false; // Apply saved state
                    });
                } else {
                    console.error('Failed to load checkbox states:', data.message);
                }
            })
            .catch(error => console.error('Error loading checkbox states:', error));
    }
    
    

    function clearClassInterface() {
        let content = document.getElementById('content');
        content.removeAttribute('data-current-class');
        content.innerHTML = '<p>Виберіть клас або створіть новий.</p>';
    }

    function toggleSession(classUUID) {
        // Send request to Flask backend
        fetch('/toggle_session', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                class_uuid: classUUID // Send the unique class UUID
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log(`Session state toggled successfully! New state: ${data.new_session_active}`);
            } else {
                alert(data.message); // Notify the user if toggling failed
            }
        })
        .catch(error => console.error('Error toggling session:', error)); // Handle request errors
    }
    

    function openClassInterface(className, classUUID) {//BODYAGA suda dobavish div s otobrageniem className no classUUID ne trogai!!!!!
        clearClassInterface();                          //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!


        let content = document.getElementById('content'); 
        content.innerHTML = `
            <div class="class-header">
                <h2>Class: ${className}</h2>
                <div class="divider"></div>
            </div>
            <div class="class-head">
                <div class="class-code-container">
                    <input type="text" class="class-code-display" value="${classUUID}" readonly>
                </div>
                <button class="session-btn" onclick ="toggleSession('${classUUID}')">Toggle session</button>
            </div>
            <br>
            <div><h2>Grade 6 <input type="checkbox" id="grade-check-6" onclick="toggleGrade(6, '${classUUID}')"></h2>
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
        </div>
        `;    
        loadCheckboxStates(classUUID); // Load saved checkbox states for this class
        monitorCheckboxStates(classUUID);
    }
    
    const style = document.createElement('style');
    style.innerHTML = `
        .modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            justify-content: center;
            align-items: center;
        }
        .modal-content {
            background: white;
            padding: 20px;
            border-radius: 15px;
            box-shadow: 0 0 5px rgba(255, 255, 255, 0.3);
            text-align: center;
            width: 350px;
            height: auto;
            border: 2px solid rgba(255, 255, 255, 0.3);
            position: relative;
        }
        .modal-content button {
            display: block;
            margin: 10px auto;
            padding: 8px;
            border: 1px solid white;
            cursor: pointer;
            background: #808080;
            color: white;
            width: 100%;
            font-size: 16px;
            border-radius: 5px;
        }
        .modal-content button:hover {
            background: #666666;
        }
        .close {
            float: right;
            cursor: pointer;
            font-size: 20px;
            font-weight: bold;
            color: #333;
        }
        .close:hover {
            color: red;
        }
    .class-code-container {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 10px 15px;
        background: linear-gradient(135deg, #f9f9f9, #e0e0e0);
        border-radius: 8px;
        border: 2px solid #aaa;
        width: fit-content;
        font-weight: bold;
        font-size: 18px;
        box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
    }

    .class-code-display {
        border: none;
        background: none;
        font-size: 20px;
        font-weight: bold;
        color: #333;
        text-align: center;
        width: 180px;
    }

    .class-code-display:focus {
        outline: none;
    }

    `;
    document.head.appendChild(style);

    document.querySelector('.logout-icon').addEventListener('click', function () {
        fetch('/logout', {
            method: 'GET'
        }).then(() => {
            window.location.href = '/';  // Redirect to login page
        });
    });

