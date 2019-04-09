import { library } from '@fortawesome/fontawesome-svg-core/index';
import * as icons from '@fortawesome/free-solid-svg-icons/index';

for (let i in icons) {
    let icon = icons[i];
    if (icon.icon) {
        library.add(icon);
    }
}
